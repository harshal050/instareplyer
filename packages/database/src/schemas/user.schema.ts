import mongoose, { Schema, Document } from 'mongoose';
import type { User } from '@instareplyer/types';

export interface UserDocument extends Omit<User, '_id'>, Document {
  password: string;
  verificationOtp?: string;
  verificationOtpExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: String,
      select: false,
    },
    verificationOtpExpiry: {
      type: Date,
      select: false,
    },
    resetToken: {
      type: String,
      select: false,
    },
    resetTokenExpiry: {
      type: Date,
      select: false,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'canceled', 'past_due', 'trialing'],
        default: 'active',
      },
      currentPeriodEnd: Date,
      stripeCustomerId: String,
      stripeSubscriptionId: String,
    },
    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      language: {
        type: String,
        default: 'en',
      },
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ createdAt: -1 });

// Exclude soft deleted users by default
userSchema.pre('find', function () {
  this.where({ deletedAt: null });
});

userSchema.pre('findOne', function () {
  this.where({ deletedAt: null });
});

export const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
