"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCampaignSchema = exports.createCampaignSchema = void 0;
const zod_1 = require("zod");
const campaignPostSchema = zod_1.z.object({
    postId: zod_1.z.string().min(1),
    postUrl: zod_1.z.string().url(),
    mediaType: zod_1.z.enum(['image', 'video', 'carousel']),
    mediaUrl: zod_1.z.string().url().optional(),
    thumbnail: zod_1.z.string().url().optional(),
    caption: zod_1.z.string().optional(),
});
exports.createCampaignSchema = zod_1.z.object({
    instagramAccountId: zod_1.z.string().min(1, 'Instagram account ID is required'),
    name: zod_1.z.string().min(2).max(255),
    description: zod_1.z.string().max(2000).optional(),
    status: zod_1.z.enum(['draft', 'active', 'paused', 'completed', 'archived']).default('draft'),
    triggerType: zod_1.z.enum(['keyword', 'all_comments', 'new_followers']).default('keyword'),
    posts: zod_1.z.array(campaignPostSchema).min(1, 'Select at least one Instagram post or reel').optional(),
    keywords: zod_1.z.array(zod_1.z.object({
        keyword: zod_1.z.string().min(1),
        matchType: zod_1.z.enum(['exact', 'contains', 'regex']).default('contains'),
        isEnabled: zod_1.z.boolean().default(true),
    })).optional(),
    dmTemplate: zod_1.z.object({
        messages: zod_1.z.array(zod_1.z.object({
            type: zod_1.z.enum(['text', 'image', 'link']).default('text'),
            content: zod_1.z.string().min(1),
            imageUrl: zod_1.z.string().url().optional(),
            linkUrl: zod_1.z.string().url().optional(),
            buttonText: zod_1.z.string().optional(),
        })),
        delay: zod_1.z.number().min(0).default(0),
    }),
    settings: zod_1.z.object({
        maxDmsPerDay: zod_1.z.number().min(1).max(1000).default(100),
        replyDelay: zod_1.z.object({
            min: zod_1.z.number().min(0),
            max: zod_1.z.number().min(0),
        }).default({ min: 5, max: 30 }),
        excludeFollowers: zod_1.z.boolean().default(false),
        excludePreviouslyMessaged: zod_1.z.boolean().default(true),
        activeHours: zod_1.z.object({
            start: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
            end: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
            timezone: zod_1.z.string(),
        }).optional(),
    }).default({}),
});
exports.updateCampaignSchema = exports.createCampaignSchema.partial();
//# sourceMappingURL=campaign.validation.js.map