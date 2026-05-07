import mongoose, { Schema, Document, Types } from 'mongoose';
import type { ActivityLog } from '@instareplyer/types';

export interface ActivityLogDocument extends Omit<ActivityLog, '_id' | 'userId' | 'campaignId'>, Document {
  userId: Types.ObjectId;
  campaignId?: Types.ObjectId;
}

const activityLogSchema = new Schema<ActivityLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      index: true,
    },
    type: {
      type: String,
      enum: [
        'campaign_created',
        'campaign_started',
        'campaign_paused',
        'dm_sent',
        'dm_failed',
        'comment_matched',
        'instagram_connected',
        'instagram_disconnected',
        'subscription_changed',
      ],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound indexes for common queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ campaignId: 1, createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });

// TTL index to auto-delete old logs (90 days)
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const ActivityLogModel =
  mongoose.models.ActivityLog ||
  mongoose.model<ActivityLogDocument>('ActivityLog', activityLogSchema);
