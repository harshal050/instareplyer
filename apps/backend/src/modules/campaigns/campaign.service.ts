import { CampaignModel, InstagramAccountModel } from '@instareplyer/database';
import type { Campaign } from '@instareplyer/types';
import type { CreateCampaignInput, UpdateCampaignInput } from './campaign.validation.js';
import { env } from '../../config/env.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import logger from '../../utils/logger.js';

export class CampaignService {
  async createCampaign(userId: string, data: CreateCampaignInput): Promise<Campaign> {
    const account = await InstagramAccountModel.findOne({ _id: data.instagramAccountId, userId });
    if (!account) {
      throw new NotFoundError('Instagram account not found');
    }

    const campaign = await CampaignModel.create({
      userId,
      instagramAccountId: data.instagramAccountId,
      name: data.name,
      description: data.description,
      status: data.status || 'draft',
      triggerType: data.triggerType || 'keyword',
      posts: data.posts || [],
      keywords: data.keywords?.map((kw, idx) => ({
        id: `kw_${idx}`,
        keyword: kw.keyword.trim(),
        matchType: kw.matchType || 'contains',
        isEnabled: kw.isEnabled ?? true,
      })) || [],
      dmTemplate: {
        messages: data.dmTemplate.messages.map((msg, idx) => ({
          id: `msg_${idx}`,
          type: msg.type || 'text',
          content: msg.content,
          imageUrl: msg.imageUrl,
          linkUrl: msg.linkUrl,
          buttonText: msg.buttonText,
        })),
        delay: data.dmTemplate.delay,
      },
      settings: {
        maxDmsPerDay: data.settings?.maxDmsPerDay || 100,
        replyDelay: data.settings?.replyDelay || { min: 5, max: 30 },
        excludeFollowers: data.settings?.excludeFollowers ?? false,
        excludePreviouslyMessaged: data.settings?.excludePreviouslyMessaged ?? true,
        activeHours: data.settings?.activeHours,
      },
      analytics: {
        totalComments: 0,
        matchedComments: 0,
        dmsSent: 0,
        dmsDelivered: 0,
        dmsFailed: 0,
        conversions: 0,
      },
    });

    return this.sanitizeCampaign(campaign);
  }

  async getCampaigns(userId: string): Promise<Campaign[]> {
    const campaigns = await CampaignModel.find({ userId }).sort({ createdAt: -1 });
    return campaigns.map((campaign) => this.sanitizeCampaign(campaign));
  }

  async getCampaignById(campaignId: string, userId: string): Promise<Campaign> {
    const campaign = await CampaignModel.findOne({ _id: campaignId, userId });

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return this.sanitizeCampaign(campaign);
  }

  async updateCampaign(
    campaignId: string,
    userId: string,
    data: UpdateCampaignInput
  ): Promise<Campaign> {
    const campaign = await CampaignModel.findOne({ _id: campaignId, userId });

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    if (data.name !== undefined) campaign.name = data.name;
    if (data.description !== undefined) campaign.description = data.description;
    if (data.status !== undefined) campaign.status = data.status;
    if (data.triggerType !== undefined) campaign.triggerType = data.triggerType;
    if (data.posts !== undefined) campaign.posts = data.posts;
    if (data.keywords !== undefined) {
      campaign.keywords = data.keywords.map((kw, idx) => ({
        id: `kw_${idx}`,
        keyword: kw.keyword.trim(),
        matchType: kw.matchType || 'contains',
        isEnabled: kw.isEnabled ?? true,
      }));
      campaign.processedCommentIds = [];
    }
    if (data.dmTemplate !== undefined) {
      campaign.dmTemplate = {
        messages: data.dmTemplate.messages.map((msg, idx) => ({
          id: `msg_${idx}`,
          type: msg.type || 'text',
          content: msg.content,
          imageUrl: msg.imageUrl,
          linkUrl: msg.linkUrl,
          buttonText: msg.buttonText,
        })),
        delay: data.dmTemplate.delay,
      };
    }
    if (data.settings !== undefined) {
      campaign.settings = { ...campaign.settings, ...data.settings };
    }

    await campaign.save();

    return this.sanitizeCampaign(campaign);
  }

  async deleteCampaign(campaignId: string, userId: string): Promise<void> {
    const campaign = await CampaignModel.findOneAndDelete({ _id: campaignId, userId });
    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }
  }

  async startCampaign(campaignId: string, userId: string): Promise<Campaign> {
    const campaign = await CampaignModel.findOne({ _id: campaignId, userId });

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    if (campaign.posts.length === 0) {
      throw new BadRequestError('Campaign must have at least one Instagram post or reel');
    }

    if (campaign.keywords.length === 0 && campaign.triggerType === 'keyword') {
      throw new BadRequestError('Campaign must have at least one keyword');
    }

    if (campaign.dmTemplate.messages.length === 0) {
      throw new BadRequestError('Campaign must have at least one DM message');
    }

    campaign.status = 'active';
    await campaign.save();

    return this.sanitizeCampaign(campaign);
  }

  async pauseCampaign(campaignId: string, userId: string): Promise<Campaign> {
    const campaign = await CampaignModel.findOne({ _id: campaignId, userId });
    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }
    campaign.status = 'paused';
    await campaign.save();
    return this.sanitizeCampaign(campaign);
  }

  async processCommentForActiveCampaign(
    data: ProcessCampaignCommentInput,
    sendCommentReply: CommentReplySender,
    userId?: string
  ): Promise<ProcessCampaignCommentResult> {
    const postIds = [...new Set([data.postId, ...(data.postIdAliases || [])].filter(Boolean))];
    const campaigns = await CampaignModel.find({
      ...(userId ? { userId } : {}),
      status: 'active',
      'posts.postId': { $in: postIds },
    }).select('+processedCommentIds').sort({ createdAt: 1 });

    if (campaigns.length === 0) {
      logger.info(
        `Comment ignored: no active campaign for postIds=${postIds.join(',')} commentId=${data.commentId}`
      );
      throw new NotFoundError('No active campaign found for this post');
    }

    for (const campaign of campaigns) {
      if (campaign.processedCommentIds?.includes(data.commentId)) {
        logger.info(
          `Comment skipped: already processed campaignId=${campaign._id} commentId=${data.commentId}`
        );
        continue;
      }

      campaign.analytics.totalComments += 1;

      const matchResult = this.evaluateCommentMatch(data.text, campaign);
      this.logCommentEvaluation(data, campaign, matchResult);

      if (!matchResult.matched) {
        this.markCommentProcessed(campaign, data.commentId);
        await campaign.save();
        continue;
      }

      campaign.analytics.matchedComments += 1;
      const message = campaign.dmTemplate.messages[0]?.content;

      if (!message) {
        campaign.analytics.dmsFailed += 1;
        await campaign.save();
        throw new BadRequestError('Campaign has no DM message');
      }

      const account = await InstagramAccountModel.findOne({
        _id: campaign.instagramAccountId,
        userId: campaign.userId,
        isActive: true,
      }).select('+accessToken');

      if (!account) {
        campaign.analytics.dmsFailed += 1;
        await campaign.save();
        throw new BadRequestError('Connected Instagram account is missing or inactive');
      }

      const accessToken = account.accessToken || env.facebook.pageAccessToken;

      if (!accessToken) {
        campaign.analytics.dmsFailed += 1;
        await campaign.save();
        throw new BadRequestError('Connected Instagram access token or PAGE_ACCESS_TOKEN must be set');
      }

      try {
        await sendCommentReply(data.commentId, message, accessToken);
        this.markCommentProcessed(campaign, data.commentId);
        campaign.analytics.dmsSent += 1;
        campaign.analytics.dmsDelivered += 1;
        await campaign.save();
      } catch (error) {
        campaign.analytics.dmsFailed += 1;
        await campaign.save();
        throw error;
      }

      return {
        matched: true,
        sent: true,
        campaignId: String(campaign._id),
        instagramAccountId: String(campaign.instagramAccountId),
      };
    }

    return { matched: false, sent: false };
  }

  private markCommentProcessed(campaign: Record<string, any>, commentId: string): void {
    const processed = campaign.processedCommentIds || [];
    if (!processed.includes(commentId)) {
      processed.push(commentId);
    }
    campaign.processedCommentIds = processed.slice(-1000);
  }

  private commentMatchesCampaign(text: string, campaign: Record<string, any>): boolean {
    return this.evaluateCommentMatch(text, campaign).matched;
  }

  private evaluateCommentMatch(text: string, campaign: Record<string, any>): CommentMatchResult {
    if (campaign.triggerType === 'all_comments') {
      return { matched: true, reason: 'trigger_type_all_comments' };
    }

    const normalizedText = this.normalizeKeywordText(text);
    const keywords = campaign.keywords || [];

    if (keywords.length === 0) {
      return { matched: false, reason: 'no_keywords', normalizedText };
    }

    for (const keyword of keywords as Array<{ isEnabled: boolean; keyword: string; matchType: string }>) {
      if (!keyword.isEnabled) continue;

      const rawKeyword = keyword.keyword.trim();
      if (!rawKeyword) continue;

      if (keyword.matchType === 'regex') {
        try {
          const matched = new RegExp(rawKeyword, 'i').test(text);
          if (matched) {
            return {
              matched: true,
              reason: 'regex_match',
              matchedKeyword: rawKeyword,
              matchType: keyword.matchType,
              normalizedText,
            };
          }
        } catch {
          continue;
        }
        continue;
      }

      for (const candidate of this.getKeywordCandidates(rawKeyword)) {
        const value = this.normalizeKeywordText(candidate);
        if (!value) continue;

        if (keyword.matchType === 'exact') {
          if (normalizedText === value) {
            return {
              matched: true,
              reason: 'exact_match',
              matchedKeyword: candidate,
              matchType: keyword.matchType,
              normalizedText,
              normalizedKeyword: value,
            };
          }
          continue;
        }

        if (normalizedText.includes(value)) {
          return {
            matched: true,
            reason: 'contains_match',
            matchedKeyword: candidate,
            matchType: keyword.matchType,
            normalizedText,
            normalizedKeyword: value,
          };
        }
      }
    }

    return { matched: false, reason: 'no_keyword_match', normalizedText };
  }

  private getKeywordCandidates(keyword: string): string[] {
    return keyword
      .split(/[\n,]+/)
      .map((candidate) => candidate.trim())
      .filter(Boolean);
  }

  private normalizeKeywordText(value: string): string {
    return value
      .normalize('NFKC')
      .toLowerCase()
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/(^|\s)#(?=\S)/g, '$1')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  private logCommentEvaluation(
    data: ProcessCampaignCommentInput,
    campaign: Record<string, any>,
    matchResult: CommentMatchResult
  ): void {
    const enabledKeywords = (campaign.keywords || [])
      .filter((keyword: { isEnabled: boolean }) => keyword.isEnabled)
      .map((keyword: { keyword: string; matchType: string }) => `${keyword.keyword.trim()}(${keyword.matchType})`)
      .join(', ');

    logger.info(
      [
        'Comment evaluated',
        `campaignId=${campaign._id}`,
        `campaignName="${this.formatLogText(String(campaign.name || ''))}"`,
        `postId=${data.postId}`,
        `commentId=${data.commentId}`,
        `matched=${matchResult.matched}`,
        `reason=${matchResult.reason}`,
        `keywords="${this.formatLogText(enabledKeywords || 'none')}"`,
        matchResult.normalizedKeyword ? `normalizedKeyword="${this.formatLogText(matchResult.normalizedKeyword)}"` : '',
      ].filter(Boolean).join(' ')
    );
  }

  private formatLogText(value: string): string {
    return value.replace(/\s+/g, ' ').slice(0, 200).replace(/"/g, '\\"');
  }

  private sanitizeCampaign(campaign: Record<string, unknown>): Campaign {
    const obj = typeof campaign.toObject === 'function' ? campaign.toObject() : campaign;
    return {
      ...obj,
      _id: String(obj._id),
      userId: String(obj.userId),
      instagramAccountId: String(obj.instagramAccountId),
    } as Campaign;
  }
}

export interface ProcessCampaignCommentInput {
  postId: string;
  postIdAliases?: string[];
  commentId: string;
  text: string;
}

export interface ProcessCampaignCommentResult {
  matched: boolean;
  sent: boolean;
  campaignId?: string;
  instagramAccountId?: string;
}

interface CommentMatchResult {
  matched: boolean;
  reason: string;
  matchedKeyword?: string;
  matchType?: string;
  normalizedText?: string;
  normalizedKeyword?: string;
}

type CommentReplySender = (
  commentId: string,
  message: string,
  accessToken: string
) => Promise<void>;

export const campaignService = new CampaignService();
