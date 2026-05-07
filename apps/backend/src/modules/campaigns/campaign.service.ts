import { CampaignModel, InstagramAccountModel } from '@instareplyer/database';
import type { Campaign } from '@instareplyer/types';
import type { CreateCampaignInput, UpdateCampaignInput } from './campaign.validation.js';
import { env } from '../../config/env.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';

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
        keyword: kw.keyword,
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
        keyword: kw.keyword,
        matchType: kw.matchType || 'contains',
        isEnabled: kw.isEnabled ?? true,
      }));
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
    sendPrivateReply: PrivateReplySender,
    userId?: string
  ): Promise<ProcessCampaignCommentResult> {
    const campaigns = await CampaignModel.find({
      ...(userId ? { userId } : {}),
      status: 'active',
      'posts.postId': data.postId,
    }).select('+processedCommentIds').sort({ createdAt: 1 });

    if (campaigns.length === 0) {
      throw new NotFoundError('No active campaign found for this post');
    }

    for (const campaign of campaigns) {
      if (campaign.processedCommentIds?.includes(data.commentId)) {
        continue;
      }

      campaign.analytics.totalComments += 1;

      if (!this.commentMatchesCampaign(data.text, campaign)) {
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

      const accessToken = env.facebook.pageAccessToken || account?.accessToken;

      if (!accessToken) {
        campaign.analytics.dmsFailed += 1;
        await campaign.save();
        throw new BadRequestError('PAGE_ACCESS_TOKEN must be set in .env.local');
      }

      try {
        await sendPrivateReply(data.commentId, message, accessToken, account.instagramUserId);
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
    if (campaign.triggerType === 'all_comments') return true;

    const normalizedText = text.toLowerCase().trim();
    return campaign.keywords.some((keyword: { isEnabled: boolean; keyword: string; matchType: string }) => {
      if (!keyword.isEnabled) return false;

      const value = keyword.keyword.toLowerCase().trim();
      if (keyword.matchType === 'exact') return normalizedText === value;
      if (keyword.matchType === 'regex') {
        try {
          return new RegExp(keyword.keyword, 'i').test(text);
        } catch {
          return false;
        }
      }

      return normalizedText.includes(value);
    });
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
  commentId: string;
  text: string;
}

export interface ProcessCampaignCommentResult {
  matched: boolean;
  sent: boolean;
  campaignId?: string;
  instagramAccountId?: string;
}

type PrivateReplySender = (
  commentId: string,
  message: string,
  accessToken: string,
  instagramUserId: string
) => Promise<void>;

export const campaignService = new CampaignService();
