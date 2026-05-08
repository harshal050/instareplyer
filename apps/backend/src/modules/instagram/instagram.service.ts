import { CampaignModel, InstagramAccountModel } from '@instareplyer/database';
import type { CampaignPost, InstagramAccount } from '@instareplyer/types';
import jwt from 'jsonwebtoken';
import type { Secret } from 'jsonwebtoken';
import type { ConnectInstagramInput, UpdateInstagramAccountInput } from './instagram.validation.js';
import { campaignService } from '../campaigns/campaign.service.js';
import { env } from '../../config/env.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';
import logger from '../../utils/logger.js';

const GRAPH_API_VERSION = 'v25.0';
const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
const FACEBOOK_DIALOG_URL = `https://www.facebook.com/${GRAPH_API_VERSION}`;
const COMMENT_POLL_INTERVAL_MS = 120_000;
const INITIAL_COMMENT_POLL_DELAY_MS = 15_000;

export class InstagramService {
  private lastReplyAt = 0;
  private pollTimer?: NodeJS.Timeout;
  private isPolling = false;

  getOAuthUrl(userId: string): string {
    const clientId = env.facebook.appId || env.instagram.clientId;
    if (!clientId) {
      throw new BadRequestError('FACEBOOK_APP_ID or INSTAGRAM_CLIENT_ID must be set in .env.local');
    }

    const state = jwt.sign(
      { userId, purpose: 'instagram_oauth' },
      env.jwt.accessSecret as Secret,
      { expiresIn: '10m' }
    );

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: this.getRedirectUri(),
      state,
      response_type: 'code',
      scope: [
        'pages_show_list',
        'pages_read_engagement',
        'instagram_basic',
        'instagram_manage_comments',
        'business_management',
      ].join(','),
    });

    return `${FACEBOOK_DIALOG_URL}/dialog/oauth?${params}`;
  }

  async connectFromOAuth(code: string, state: string): Promise<InstagramAccount> {
    const payload = this.verifyOAuthState(state);
    const token = await this.exchangeCodeForAccessToken(code);
    const longLivedToken = await this.exchangeForLongLivedToken(token.access_token).catch(() => token);
    const page = await this.findInstagramPage(longLivedToken.access_token);
    const instagramAccount = page.instagram_business_account;
    if (!instagramAccount) {
      throw new BadRequestError('No Instagram Business or Creator account linked to your Facebook Pages was found.');
    }

    return this.connectAccount(payload.userId, {
      accessToken: page.access_token,
      instagramUserId: instagramAccount.id,
      username: instagramAccount.username,
      profilePicture: instagramAccount.profile_picture_url,
    });
  }

  async connectAccount(userId: string, data: ConnectInstagramInput): Promise<InstagramAccount> {
    const account = await InstagramAccountModel.findOneAndUpdate(
      { userId, instagramUserId: data.instagramUserId },
      {
        $set: {
          username: data.username,
          profilePicture: data.profilePicture,
          accessToken: data.accessToken,
          tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return this.sanitizeAccount(account);
  }

  async connectConfiguredAccount(userId: string): Promise<InstagramAccount> {
    if (!env.facebook.pageAccessToken || !env.instagram.businessId) {
      throw new BadRequestError('PAGE_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ID must be set in .env.local');
    }

    const profile = await this.fetchInstagramProfile(env.instagram.businessId, env.facebook.pageAccessToken);

    return this.connectAccount(userId, {
      accessToken: env.facebook.pageAccessToken,
      instagramUserId: env.instagram.businessId,
      username: profile.username || env.instagram.businessId,
      profilePicture: profile.profile_picture_url,
    });
  }

  async getMedia(accountId: string, userId: string): Promise<CampaignPost[]> {
    const account = await InstagramAccountModel.findOne({ _id: accountId, userId }).select('+accessToken');
    if (!account) {
      throw new NotFoundError('Instagram account not found');
    }

    const accessToken = account.accessToken || env.facebook.pageAccessToken || '';
    const media = await this.fetchAccountMedia(account.instagramUserId, accessToken);

    return media.map((item) => ({
      postId: item.id,
      postUrl: item.permalink,
      mediaType: this.mapMediaType(item.media_type),
      mediaUrl: item.media_url,
      thumbnail: item.thumbnail_url || item.media_url,
      caption: item.caption,
    }));
  }

  async getAccounts(userId: string): Promise<InstagramAccount[]> {
    const accounts = await InstagramAccountModel.find({ userId }).sort({ createdAt: -1 });
    return accounts.map((account) => this.sanitizeAccount(account));
  }

  async getAccountById(accountId: string, userId: string): Promise<InstagramAccount> {
    const account = await InstagramAccountModel.findOne({ _id: accountId, userId });

    if (!account) {
      throw new NotFoundError('Instagram account not found');
    }

    return this.sanitizeAccount(account);
  }

  async updateAccount(
    accountId: string,
    userId: string,
    data: UpdateInstagramAccountInput
  ): Promise<InstagramAccount> {
    const account = await InstagramAccountModel.findOneAndUpdate(
      { _id: accountId, userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!account) {
      throw new NotFoundError('Instagram account not found');
    }

    return this.sanitizeAccount(account);
  }

  async disconnectAccount(accountId: string, userId: string): Promise<void> {
    const account = await InstagramAccountModel.findOneAndDelete({ _id: accountId, userId });
    if (!account) {
      throw new NotFoundError('Instagram account not found');
    }
  }

  async processComment(userId: string, data: ProcessCommentInput): Promise<ProcessCommentResult> {
    return campaignService.processCommentForActiveCampaign(
      data,
      async (commentId, message, accessToken) => {
        await this.waitForReplySlot();
        await this.sendCommentReply(commentId, message, accessToken);
      },
      userId
    );
  }

  async processWebhookPayload(payload: InstagramWebhookPayload): Promise<WebhookProcessResult> {
    const events = this.extractCommentEvents(payload);
    const result: WebhookProcessResult = {
      received: events.length,
      processed: 0,
      matched: 0,
      sent: 0,
      ignored: 0,
      errors: [],
    };

    for (const event of events) {
      try {
        const outcome = await campaignService.processCommentForActiveCampaign(
          event,
          async (commentId, message, accessToken) => {
            await this.waitForReplySlot();
            await this.sendCommentReply(commentId, message, accessToken);
          }
        );
        result.processed += 1;
        if (outcome.matched) result.matched += 1;
        if (outcome.sent) result.sent += 1;
      } catch (error) {
        if (error instanceof NotFoundError) {
          result.ignored += 1;
        } else {
          result.errors.push((error as Error).message || 'Failed to process Instagram comment');
        }
      }
    }

    return result;
  }

  startCommentPolling(): void {
    if (this.pollTimer) {
      return;
    }

    this.pollTimer = setInterval(() => {
      this.pollActiveCampaignComments().catch((error) => {
        logger.error(`Instagram comment polling failed: ${(error as Error).message}`);
      });
    }, COMMENT_POLL_INTERVAL_MS);

    setTimeout(() => {
      this.pollActiveCampaignComments().catch((error) => {
        logger.error(`Initial Instagram comment poll failed: ${(error as Error).message}`);
      });
    }, INITIAL_COMMENT_POLL_DELAY_MS);

    logger.info(`Instagram comment polling started intervalMs=${COMMENT_POLL_INTERVAL_MS}`);
  }

  stopCommentPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
  }

  async pollActiveCampaignComments(): Promise<PollCommentsResult> {
    if (this.isPolling) {
      return { campaigns: 0, posts: 0, comments: 0, matched: 0, sent: 0, skipped: true, errors: [] };
    }

    this.isPolling = true;
    const result: PollCommentsResult = {
      campaigns: 0,
      posts: 0,
      comments: 0,
      matched: 0,
      sent: 0,
      skipped: false,
      errors: [],
    };

    try {
      const campaigns = await CampaignModel.find({ status: 'active' }).select('posts instagramAccountId userId');
      result.campaigns = campaigns.length;

      const accountIds = [...new Set(campaigns.map((campaign) => String(campaign.instagramAccountId)))];
      const accounts = await InstagramAccountModel.find({
        _id: { $in: accountIds },
        isActive: true,
      }).select('+accessToken');
      const accountsById = new Map(accounts.map((account) => [String(account._id), account]));
      const campaignsByAccountId = new Map<string, typeof campaigns>();

      for (const campaign of campaigns) {
        const accountId = String(campaign.instagramAccountId);
        campaignsByAccountId.set(accountId, [...(campaignsByAccountId.get(accountId) || []), campaign]);
      }

      for (const [accountId, accountCampaigns] of campaignsByAccountId) {
        const account = accountsById.get(accountId);
        const accessToken = account?.accessToken || env.facebook.pageAccessToken || '';
        if (!accessToken) {
          result.errors.push(`Instagram account ${accountId}: connected Instagram access token is missing`);
          continue;
        }
        if (!account?.instagramUserId) {
          result.errors.push(`Instagram account ${accountId}: Instagram business ID is missing`);
          continue;
        }

        const selectedPostIds = new Set<string>();
        for (const campaign of accountCampaigns) {
          for (const post of campaign.posts || []) {
            selectedPostIds.add(post.postId);
            if (post.postUrl) selectedPostIds.add(post.postUrl);
          }
        }

        let media: InstagramMedia[] = [];
        try {
          media = await this.fetchAccountMedia(account.instagramUserId, accessToken);
        } catch (error) {
          result.errors.push(`Instagram account ${accountId}: ${(error as Error).message}`);
          continue;
        }

        const mediaToCheck = media.filter((item) => {
          const aliases = [item.id, item.permalink, account.instagramUserId, env.instagram.businessId || ''];
          return aliases.some((alias) => selectedPostIds.has(alias));
        });

        for (const item of mediaToCheck) {
          result.posts += 1;
          let comments: InstagramComment[] = [];
          try {
            comments = await this.fetchRecentComments(item.id, accessToken);
          } catch (error) {
            result.errors.push(`Media ${item.id}: ${(error as Error).message}`);
            continue;
          }
          result.comments += comments.length;

          for (const comment of comments.reverse()) {
            try {
              const outcome = await campaignService.processCommentForActiveCampaign(
                {
                  postId: item.id,
                  postIdAliases: [item.permalink, account.instagramUserId, env.instagram.businessId || ''],
                  commentId: comment.id,
                  text: comment.text,
                },
                async (commentId, message, accessToken) => {
                  await this.waitForReplySlot();
                  await this.sendCommentReply(commentId, message, accessToken);
                }
              );

              if (outcome.matched) result.matched += 1;
              if (outcome.sent) result.sent += 1;
            } catch (error) {
              if (!(error instanceof NotFoundError)) {
                result.errors.push(`Media ${item.id}, comment ${comment.id}: ${(error as Error).message}`);
              }
            }
          }
        }
      }

      if (result.comments > 0 || result.errors.length > 0) {
        logger.info(
          `Instagram poll: campaigns=${result.campaigns}, posts=${result.posts}, comments=${result.comments}, matched=${result.matched}, sent=${result.sent}, errors=${result.errors.length}`
        );
      }

      return result;
    } finally {
      this.isPolling = false;
    }
  }

  private async waitForReplySlot(): Promise<void> {
    const elapsed = Date.now() - this.lastReplyAt;
    if (elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
    }
    this.lastReplyAt = Date.now();
  }

  private extractCommentEvents(payload: InstagramWebhookPayload): ProcessCommentInput[] {
    const events: ProcessCommentInput[] = [];

    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== 'comments') continue;

        const commentId = change.value?.id || change.value?.comment_id;
        const postId = change.value?.media?.id || change.value?.media_id || change.value?.post_id;
        const text = change.value?.text || change.value?.message;

        if (commentId && postId && typeof text === 'string') {
          events.push({ commentId, postId, text });
        }
      }
    }

    return events;
  }

  private async fetchAccountMedia(instagramUserId: string, accessToken: string): Promise<InstagramMedia[]> {
    const token = accessToken || env.facebook.pageAccessToken;
    if (!token) {
      throw new BadRequestError('PAGE_ACCESS_TOKEN must be set in .env.local');
    }

    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
      access_token: token,
      limit: '50',
    });
    const response = await fetch(`${FACEBOOK_GRAPH_URL}/${instagramUserId}/media?${params}`);
    const data = (await response.json()) as { data?: InstagramMedia[]; error?: GraphApiError };

    if (!response.ok || data.error) {
      throw new BadRequestError(this.formatGraphError(data.error, 'Unable to fetch Instagram media'));
    }

    return data.data || [];
  }

  private async fetchRecentComments(postId: string, accessToken: string): Promise<InstagramComment[]> {
    const params = new URLSearchParams({
      fields: 'id,text,timestamp,username',
      access_token: accessToken,
      limit: '25',
    });

    const response = await fetch(`${FACEBOOK_GRAPH_URL}/${postId}/comments?${params}`);
    const data = (await response.json()) as {
      data?: InstagramComment[];
      error?: GraphApiError;
    };

    if (!response.ok || data.error) {
      throw new BadRequestError(this.formatGraphError(data.error, 'Unable to fetch Instagram comments'));
    }

    return data.data || [];
  }

  private async sendCommentReply(
    commentId: string,
    message: string,
    accessToken: string
  ): Promise<void> {
    const token = accessToken || env.facebook.pageAccessToken;
    if (!token) {
      throw new BadRequestError('PAGE_ACCESS_TOKEN must be set in .env.local');
    }

    const params = new URLSearchParams({ access_token: token });
    const response = await fetch(`${FACEBOOK_GRAPH_URL}/${commentId}/replies?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ message }),
    });
    const responseText = await response.text();
    let data: GraphApiMutationResponse = {};

    try {
      data = responseText ? JSON.parse(responseText) as GraphApiMutationResponse : {};
    } catch {
      data = {};
    }

    if (!response.ok || data.error) {
      throw new BadRequestError(
        this.formatGraphError(
          data.error,
          `Unable to send Instagram comment reply status=${response.status} body="${this.formatLogText(responseText)}"`
        )
      );
    }

    logger.info(
      `Instagram comment reply sent: commentId=${commentId} replyId=${data.id || 'unknown'}`
    );
  }

  private formatGraphError(error: GraphApiError | undefined, fallback: string): string {
    if (!error) return fallback;

    const parts = [error.message || fallback];
    if (error.code !== undefined) parts.push(`code=${error.code}`);
    if (error.error_subcode !== undefined) parts.push(`subcode=${error.error_subcode}`);
    if (error.fbtrace_id) parts.push(`trace=${error.fbtrace_id}`);
    return parts.join(' ');
  }

  private async fetchInstagramProfile(instagramUserId: string, accessToken: string) {
    const params = new URLSearchParams({
      fields: 'id,username,profile_picture_url',
      access_token: accessToken,
    });
    const response = await fetch(`${FACEBOOK_GRAPH_URL}/${instagramUserId}?${params}`);
    const data = (await response.json()) as {
      id?: string;
      username?: string;
      profile_picture_url?: string;
      error?: { message?: string };
    };

    if (!response.ok || data.error) {
      throw new BadRequestError(data.error?.message || 'Unable to verify Instagram account');
    }

    return data;
  }

  private getRedirectUri(): string {
    return env.instagram.redirectUri || `${env.apiUrl}/api/instagram/oauth/callback`;
  }

  private verifyOAuthState(state: string): InstagramOAuthState {
    try {
      const payload = jwt.verify(state, env.jwt.accessSecret) as Partial<InstagramOAuthState>;
      if (payload.purpose !== 'instagram_oauth' || !payload.userId) {
        throw new Error('Invalid OAuth state');
      }
      return { userId: payload.userId, purpose: 'instagram_oauth' };
    } catch {
      throw new BadRequestError('Instagram authorization expired. Please try connecting again.');
    }
  }

  private formatLogText(value: string): string {
    return value.replace(/\s+/g, ' ').slice(0, 200).replace(/"/g, '\\"');
  }

  private async exchangeCodeForAccessToken(code: string): Promise<FacebookTokenResponse> {
    const clientId = env.facebook.appId || env.instagram.clientId;
    const clientSecret = env.facebook.appSecret || env.instagram.clientSecret;
    if (!clientId || !clientSecret) {
      throw new BadRequestError('Facebook app credentials must be set in .env.local');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: this.getRedirectUri(),
      code,
    });

    return this.facebookGet<FacebookTokenResponse>(`/oauth/access_token?${params}`);
  }

  private async exchangeForLongLivedToken(accessToken: string): Promise<FacebookTokenResponse> {
    const clientId = env.facebook.appId || env.instagram.clientId;
    const clientSecret = env.facebook.appSecret || env.instagram.clientSecret;
    if (!clientId || !clientSecret) {
      throw new BadRequestError('Facebook app credentials must be set in .env.local');
    }

    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: clientId,
      client_secret: clientSecret,
      fb_exchange_token: accessToken,
    });

    return this.facebookGet<FacebookTokenResponse>(`/oauth/access_token?${params}`);
  }

  private async findInstagramPage(userAccessToken: string): Promise<FacebookPageWithInstagram> {
    const params = new URLSearchParams({
      fields: 'id,name,access_token,instagram_business_account{id,username,profile_picture_url}',
      access_token: userAccessToken,
      limit: '100',
    });
    const response = await this.facebookGet<{ data?: FacebookPageWithInstagram[] }>(`/me/accounts?${params}`);
    const pages = response.data || [];
    const page = env.facebook.pageId
      ? pages.find((item) => item.id === env.facebook.pageId && item.instagram_business_account)
      : pages.find((item) => item.instagram_business_account);

    if (!page?.instagram_business_account?.id || !page.access_token) {
      throw new BadRequestError('No Instagram Business or Creator account linked to your Facebook Pages was found.');
    }

    return page;
  }

  private async facebookGet<T>(path: string): Promise<T> {
    const response = await fetch(`${FACEBOOK_GRAPH_URL}${path}`);
    const data = (await response.json()) as T & { error?: { message?: string } };

    if (!response.ok || data.error) {
      throw new BadRequestError(data.error?.message || 'Facebook authorization failed');
    }

    return data;
  }

  private mapMediaType(mediaType: string): CampaignPost['mediaType'] {
    if (mediaType === 'VIDEO' || mediaType === 'REELS') return 'video';
    if (mediaType === 'CAROUSEL_ALBUM') return 'carousel';
    return 'image';
  }

  private sanitizeAccount(account: Record<string, unknown>): InstagramAccount {
    const obj = typeof account.toObject === 'function' ? account.toObject() : account;
    return {
      ...obj,
      _id: String(obj._id),
      userId: String(obj.userId),
      accessToken: '',
    } as InstagramAccount;
  }
}

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
}

interface InstagramComment {
  id: string;
  text: string;
  timestamp?: string;
  username?: string;
}

interface GraphApiError {
  message?: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  fbtrace_id?: string;
}

interface GraphApiMutationResponse {
  id?: string;
  success?: boolean;
  error?: GraphApiError;
}

interface InstagramOAuthState {
  userId: string;
  purpose: 'instagram_oauth';
}

interface FacebookTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

interface FacebookPageWithInstagram {
  id: string;
  name?: string;
  access_token: string;
  instagram_business_account?: {
    id: string;
    username: string;
    profile_picture_url?: string;
  };
}

interface ProcessCommentInput {
  postId: string;
  commentId: string;
  text: string;
}

interface ProcessCommentResult {
  matched: boolean;
  sent: boolean;
  campaignId?: string;
}

interface WebhookProcessResult {
  received: number;
  processed: number;
  matched: number;
  sent: number;
  ignored: number;
  errors: string[];
}

interface PollCommentsResult {
  campaigns: number;
  posts: number;
  comments: number;
  matched: number;
  sent: number;
  skipped: boolean;
  errors: string[];
}

interface InstagramWebhookPayload {
  entry?: Array<{
    changes?: Array<{
      field?: string;
      value?: {
        id?: string;
        comment_id?: string;
        media?: { id?: string };
        media_id?: string;
        post_id?: string;
        text?: string;
        message?: string;
      };
    }>;
  }>;
}

export const instagramService = new InstagramService();
