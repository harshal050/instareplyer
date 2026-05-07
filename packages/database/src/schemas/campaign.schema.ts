import mongoose, { Schema, Document, Types } from 'mongoose';
import type { Campaign } from '@instareplyer/types';

export interface CampaignDocument
  extends Omit<Campaign, '_id' | 'userId' | 'instagramAccountId'>,
    Document {
  userId: Types.ObjectId;
  instagramAccountId: Types.ObjectId;
}

const keywordRuleSchema = new Schema(
  {
    id: { type: String, required: true },
    keyword: { type: String, required: true },
    matchType: {
      type: String,
      enum: ['exact', 'contains', 'regex'],
      default: 'contains',
    },
    isEnabled: { type: Boolean, default: true },
  },
  { _id: false }
);

const dmMessageSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'image', 'link'],
      default: 'text',
    },
    content: { type: String, required: true },
    imageUrl: String,
    linkUrl: String,
    buttonText: String,
  },
  { _id: false }
);

const campaignPostSchema = new Schema(
  {
    postId: { type: String, required: true },
    postUrl: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'carousel'],
      default: 'image',
    },
    mediaUrl: String,
    thumbnail: String,
    caption: String,
  },
  { _id: false }
);

const campaignSchema = new Schema<CampaignDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    instagramAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'InstagramAccount',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'completed', 'archived'],
      default: 'draft',
      index: true,
    },
    triggerType: {
      type: String,
      enum: ['keyword', 'all_comments', 'new_followers'],
      default: 'keyword',
    },
    posts: [campaignPostSchema],
    keywords: [keywordRuleSchema],
    dmTemplate: {
      messages: [dmMessageSchema],
      delay: { type: Number, default: 5 },
    },
    settings: {
      maxDmsPerDay: { type: Number, default: 50 },
      replyDelay: {
        min: { type: Number, default: 30 },
        max: { type: Number, default: 120 },
      },
      excludeFollowers: { type: Boolean, default: false },
      excludePreviouslyMessaged: { type: Boolean, default: true },
      activeHours: {
        start: String,
        end: String,
        timezone: String,
      },
    },
    analytics: {
      totalComments: { type: Number, default: 0 },
      matchedComments: { type: Number, default: 0 },
      dmsSent: { type: Number, default: 0 },
      dmsDelivered: { type: Number, default: 0 },
      dmsFailed: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
    processedCommentIds: {
      type: [String],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ userId: 1, createdAt: -1 });

export const CampaignModel =
  mongoose.models.Campaign || mongoose.model<CampaignDocument>('Campaign', campaignSchema);
