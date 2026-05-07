import mongoose, { Schema, Document, Types } from 'mongoose';
import type { InstagramAccount } from '@instareplyer/types';

export interface InstagramAccountDocument extends Omit<InstagramAccount, '_id' | 'userId'>, Document {
  userId: Types.ObjectId;
}

const instagramAccountSchema = new Schema<InstagramAccountDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    instagramUserId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePicture: String,
    accessToken: {
      type: String,
      required: true,
      select: false, // Don't include in queries by default
    },
    tokenExpiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
instagramAccountSchema.index({ userId: 1, isActive: 1 });
instagramAccountSchema.index({ tokenExpiresAt: 1 }); // For finding expiring tokens

export const InstagramAccountModel =
  mongoose.models.InstagramAccount ||
  mongoose.model<InstagramAccountDocument>('InstagramAccount', instagramAccountSchema);
