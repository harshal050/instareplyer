"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
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
exports.UserModel = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.schema.js.map