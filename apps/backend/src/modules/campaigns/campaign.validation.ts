import { z } from 'zod';
import type { CampaignStatus, TriggerType } from '@instareplyer/types';

const campaignPostSchema = z.object({
  postId: z.string().min(1),
  postUrl: z.string().url(),
  mediaType: z.enum(['image', 'video', 'carousel']),
  mediaUrl: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  caption: z.string().optional(),
});

export const createCampaignSchema = z.object({
  instagramAccountId: z.string().min(1, 'Instagram account ID is required'),
  name: z.string().min(2).max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']).default('draft'),
  triggerType: z.enum(['keyword', 'all_comments', 'new_followers']).default('keyword'),
  posts: z.array(campaignPostSchema).min(1, 'Select at least one Instagram post or reel').optional(),
  keywords: z.array(
    z.object({
      keyword: z.string().min(1),
      matchType: z.enum(['exact', 'contains', 'regex']).default('contains'),
      isEnabled: z.boolean().default(true),
    })
  ).optional(),
  dmTemplate: z.object({
    messages: z.array(
      z.object({
        type: z.enum(['text', 'image', 'link']).default('text'),
        content: z.string().min(1),
        imageUrl: z.string().url().optional(),
        linkUrl: z.string().url().optional(),
        buttonText: z.string().optional(),
      })
    ),
    delay: z.number().min(0).default(0),
  }),
  settings: z.object({
    maxDmsPerDay: z.number().min(1).max(1000).default(100),
    replyDelay: z.object({
      min: z.number().min(0),
      max: z.number().min(0),
    }).default({ min: 5, max: 30 }),
    excludeFollowers: z.boolean().default(false),
    excludePreviouslyMessaged: z.boolean().default(true),
    activeHours: z.object({
      start: z.string().regex(/^\d{2}:\d{2}$/),
      end: z.string().regex(/^\d{2}:\d{2}$/),
      timezone: z.string(),
    }).optional(),
  }).default({}),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
