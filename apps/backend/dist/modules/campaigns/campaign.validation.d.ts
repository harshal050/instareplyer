import { z } from 'zod';
export declare const createCampaignSchema: z.ZodObject<{
    instagramAccountId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["draft", "active", "paused", "completed", "archived"]>>;
    triggerType: z.ZodDefault<z.ZodEnum<["keyword", "all_comments", "new_followers"]>>;
    posts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        postId: z.ZodString;
        postUrl: z.ZodString;
        mediaType: z.ZodEnum<["image", "video", "carousel"]>;
        mediaUrl: z.ZodOptional<z.ZodString>;
        thumbnail: z.ZodOptional<z.ZodString>;
        caption: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        postId: string;
        postUrl: string;
        mediaType: "image" | "video" | "carousel";
        mediaUrl?: string | undefined;
        thumbnail?: string | undefined;
        caption?: string | undefined;
    }, {
        postId: string;
        postUrl: string;
        mediaType: "image" | "video" | "carousel";
        mediaUrl?: string | undefined;
        thumbnail?: string | undefined;
        caption?: string | undefined;
    }>, "many">>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodObject<{
        keyword: z.ZodString;
        matchType: z.ZodDefault<z.ZodEnum<["exact", "contains", "regex"]>>;
        isEnabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        keyword: string;
        matchType: "exact" | "contains" | "regex";
        isEnabled: boolean;
    }, {
        keyword: string;
        matchType?: "exact" | "contains" | "regex" | undefined;
        isEnabled?: boolean | undefined;
    }>, "many">>;
    dmTemplate: z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            type: z.ZodDefault<z.ZodEnum<["text", "image", "link"]>>;
            content: z.ZodString;
            imageUrl: z.ZodOptional<z.ZodString>;
            linkUrl: z.ZodOptional<z.ZodString>;
            buttonText: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "image" | "text" | "link";
            content: string;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }, {
            content: string;
            type?: "image" | "text" | "link" | undefined;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }>, "many">;
        delay: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        messages: {
            type: "image" | "text" | "link";
            content: string;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }[];
        delay: number;
    }, {
        messages: {
            content: string;
            type?: "image" | "text" | "link" | undefined;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }[];
        delay?: number | undefined;
    }>;
    settings: z.ZodDefault<z.ZodObject<{
        maxDmsPerDay: z.ZodDefault<z.ZodNumber>;
        replyDelay: z.ZodDefault<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            max: number;
            min: number;
        }, {
            max: number;
            min: number;
        }>>;
        excludeFollowers: z.ZodDefault<z.ZodBoolean>;
        excludePreviouslyMessaged: z.ZodDefault<z.ZodBoolean>;
        activeHours: z.ZodOptional<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
            timezone: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            end: string;
            timezone: string;
            start: string;
        }, {
            end: string;
            timezone: string;
            start: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        maxDmsPerDay: number;
        replyDelay: {
            max: number;
            min: number;
        };
        excludeFollowers: boolean;
        excludePreviouslyMessaged: boolean;
        activeHours?: {
            end: string;
            timezone: string;
            start: string;
        } | undefined;
    }, {
        maxDmsPerDay?: number | undefined;
        replyDelay?: {
            max: number;
            min: number;
        } | undefined;
        excludeFollowers?: boolean | undefined;
        excludePreviouslyMessaged?: boolean | undefined;
        activeHours?: {
            end: string;
            timezone: string;
            start: string;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "draft" | "paused" | "completed" | "archived";
    name: string;
    settings: {
        maxDmsPerDay: number;
        replyDelay: {
            max: number;
            min: number;
        };
        excludeFollowers: boolean;
        excludePreviouslyMessaged: boolean;
        activeHours?: {
            end: string;
            timezone: string;
            start: string;
        } | undefined;
    };
    instagramAccountId: string;
    triggerType: "keyword" | "all_comments" | "new_followers";
    dmTemplate: {
        messages: {
            type: "image" | "text" | "link";
            content: string;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }[];
        delay: number;
    };
    description?: string | undefined;
    posts?: {
        postId: string;
        postUrl: string;
        mediaType: "image" | "video" | "carousel";
        mediaUrl?: string | undefined;
        thumbnail?: string | undefined;
        caption?: string | undefined;
    }[] | undefined;
    keywords?: {
        keyword: string;
        matchType: "exact" | "contains" | "regex";
        isEnabled: boolean;
    }[] | undefined;
}, {
    name: string;
    instagramAccountId: string;
    dmTemplate: {
        messages: {
            content: string;
            type?: "image" | "text" | "link" | undefined;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }[];
        delay?: number | undefined;
    };
    status?: "active" | "draft" | "paused" | "completed" | "archived" | undefined;
    settings?: {
        maxDmsPerDay?: number | undefined;
        replyDelay?: {
            max: number;
            min: number;
        } | undefined;
        excludeFollowers?: boolean | undefined;
        excludePreviouslyMessaged?: boolean | undefined;
        activeHours?: {
            end: string;
            timezone: string;
            start: string;
        } | undefined;
    } | undefined;
    description?: string | undefined;
    triggerType?: "keyword" | "all_comments" | "new_followers" | undefined;
    posts?: {
        postId: string;
        postUrl: string;
        mediaType: "image" | "video" | "carousel";
        mediaUrl?: string | undefined;
        thumbnail?: string | undefined;
        caption?: string | undefined;
    }[] | undefined;
    keywords?: {
        keyword: string;
        matchType?: "exact" | "contains" | "regex" | undefined;
        isEnabled?: boolean | undefined;
    }[] | undefined;
}>;
export declare const updateCampaignSchema: z.ZodObject<{
    instagramAccountId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["draft", "active", "paused", "completed", "archived"]>>>;
    triggerType: z.ZodOptional<z.ZodDefault<z.ZodEnum<["keyword", "all_comments", "new_followers"]>>>;
    posts: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        postId: z.ZodString;
        postUrl: z.ZodString;
        mediaType: z.ZodEnum<["image", "video", "carousel"]>;
        mediaUrl: z.ZodOptional<z.ZodString>;
        thumbnail: z.ZodOptional<z.ZodString>;
        caption: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        postId: string;
        postUrl: string;
        mediaType: "image" | "video" | "carousel";
        mediaUrl?: string | undefined;
        thumbnail?: string | undefined;
        caption?: string | undefined;
    }, {
        postId: string;
        postUrl: string;
        mediaType: "image" | "video" | "carousel";
        mediaUrl?: string | undefined;
        thumbnail?: string | undefined;
        caption?: string | undefined;
    }>, "many">>>;
    keywords: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        keyword: z.ZodString;
        matchType: z.ZodDefault<z.ZodEnum<["exact", "contains", "regex"]>>;
        isEnabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        keyword: string;
        matchType: "exact" | "contains" | "regex";
        isEnabled: boolean;
    }, {
        keyword: string;
        matchType?: "exact" | "contains" | "regex" | undefined;
        isEnabled?: boolean | undefined;
    }>, "many">>>;
    dmTemplate: z.ZodOptional<z.ZodObject<{
        messages: z.ZodArray<z.ZodObject<{
            type: z.ZodDefault<z.ZodEnum<["text", "image", "link"]>>;
            content: z.ZodString;
            imageUrl: z.ZodOptional<z.ZodString>;
            linkUrl: z.ZodOptional<z.ZodString>;
            buttonText: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "image" | "text" | "link";
            content: string;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }, {
            content: string;
            type?: "image" | "text" | "link" | undefined;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }>, "many">;
        delay: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        messages: {
            type: "image" | "text" | "link";
            content: string;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }[];
        delay: number;
    }, {
        messages: {
            content: string;
            type?: "image" | "text" | "link" | undefined;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }[];
        delay?: number | undefined;
    }>>;
    settings: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        maxDmsPerDay: z.ZodDefault<z.ZodNumber>;
        replyDelay: z.ZodDefault<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            max: number;
            min: number;
        }, {
            max: number;
            min: number;
        }>>;
        excludeFollowers: z.ZodDefault<z.ZodBoolean>;
        excludePreviouslyMessaged: z.ZodDefault<z.ZodBoolean>;
        activeHours: z.ZodOptional<z.ZodObject<{
            start: z.ZodString;
            end: z.ZodString;
            timezone: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            end: string;
            timezone: string;
            start: string;
        }, {
            end: string;
            timezone: string;
            start: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        maxDmsPerDay: number;
        replyDelay: {
            max: number;
            min: number;
        };
        excludeFollowers: boolean;
        excludePreviouslyMessaged: boolean;
        activeHours?: {
            end: string;
            timezone: string;
            start: string;
        } | undefined;
    }, {
        maxDmsPerDay?: number | undefined;
        replyDelay?: {
            max: number;
            min: number;
        } | undefined;
        excludeFollowers?: boolean | undefined;
        excludePreviouslyMessaged?: boolean | undefined;
        activeHours?: {
            end: string;
            timezone: string;
            start: string;
        } | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    status?: "active" | "draft" | "paused" | "completed" | "archived" | undefined;
    name?: string | undefined;
    settings?: {
        maxDmsPerDay: number;
        replyDelay: {
            max: number;
            min: number;
        };
        excludeFollowers: boolean;
        excludePreviouslyMessaged: boolean;
        activeHours?: {
            end: string;
            timezone: string;
            start: string;
        } | undefined;
    } | undefined;
    description?: string | undefined;
    instagramAccountId?: string | undefined;
    triggerType?: "keyword" | "all_comments" | "new_followers" | undefined;
    posts?: {
        postId: string;
        postUrl: string;
        mediaType: "image" | "video" | "carousel";
        mediaUrl?: string | undefined;
        thumbnail?: string | undefined;
        caption?: string | undefined;
    }[] | undefined;
    keywords?: {
        keyword: string;
        matchType: "exact" | "contains" | "regex";
        isEnabled: boolean;
    }[] | undefined;
    dmTemplate?: {
        messages: {
            type: "image" | "text" | "link";
            content: string;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }[];
        delay: number;
    } | undefined;
}, {
    status?: "active" | "draft" | "paused" | "completed" | "archived" | undefined;
    name?: string | undefined;
    settings?: {
        maxDmsPerDay?: number | undefined;
        replyDelay?: {
            max: number;
            min: number;
        } | undefined;
        excludeFollowers?: boolean | undefined;
        excludePreviouslyMessaged?: boolean | undefined;
        activeHours?: {
            end: string;
            timezone: string;
            start: string;
        } | undefined;
    } | undefined;
    description?: string | undefined;
    instagramAccountId?: string | undefined;
    triggerType?: "keyword" | "all_comments" | "new_followers" | undefined;
    posts?: {
        postId: string;
        postUrl: string;
        mediaType: "image" | "video" | "carousel";
        mediaUrl?: string | undefined;
        thumbnail?: string | undefined;
        caption?: string | undefined;
    }[] | undefined;
    keywords?: {
        keyword: string;
        matchType?: "exact" | "contains" | "regex" | undefined;
        isEnabled?: boolean | undefined;
    }[] | undefined;
    dmTemplate?: {
        messages: {
            content: string;
            type?: "image" | "text" | "link" | undefined;
            imageUrl?: string | undefined;
            linkUrl?: string | undefined;
            buttonText?: string | undefined;
        }[];
        delay?: number | undefined;
    } | undefined;
}>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
//# sourceMappingURL=campaign.validation.d.ts.map