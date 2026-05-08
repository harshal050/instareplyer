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
exports.CampaignModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const keywordRuleSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    keyword: { type: String, required: true },
    matchType: {
        type: String,
        enum: ['exact', 'contains', 'regex'],
        default: 'contains',
    },
    isEnabled: { type: Boolean, default: true },
}, { _id: false });
const dmMessageSchema = new mongoose_1.Schema({
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
}, { _id: false });
const campaignPostSchema = new mongoose_1.Schema({
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
}, { _id: false });
const campaignSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    instagramAccountId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Compound indexes
campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ userId: 1, createdAt: -1 });
exports.CampaignModel = mongoose_1.default.models.Campaign || mongoose_1.default.model('Campaign', campaignSchema);
//# sourceMappingURL=campaign.schema.js.map