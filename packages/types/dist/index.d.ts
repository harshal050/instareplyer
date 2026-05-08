export interface User {
    _id: string;
    email: string;
    name: string;
    avatar?: string;
    role: UserRole;
    isVerified: boolean;
    subscription: UserSubscription;
    settings: UserSettings;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export type UserRole = 'user' | 'admin' | 'super_admin';
export interface UserSubscription {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    currentPeriodEnd?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}
export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';
export interface UserSettings {
    notifications: boolean;
    emailNotifications: boolean;
    timezone: string;
    language: string;
}
export interface InstagramAccount {
    _id: string;
    userId: string;
    instagramUserId: string;
    username: string;
    profilePicture?: string;
    accessToken: string;
    tokenExpiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface Campaign {
    _id: string;
    userId: string;
    instagramAccountId: string;
    name: string;
    description?: string;
    status: CampaignStatus;
    triggerType: TriggerType;
    posts: CampaignPost[];
    keywords: KeywordRule[];
    dmTemplate: DMTemplate;
    settings: CampaignSettings;
    analytics: CampaignAnalytics;
    processedCommentIds?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';
export type TriggerType = 'keyword' | 'all_comments' | 'new_followers';
export interface CampaignPost {
    postId: string;
    postUrl: string;
    mediaType: 'image' | 'video' | 'carousel';
    mediaUrl?: string;
    thumbnail?: string;
    caption?: string;
}
export interface KeywordRule {
    id: string;
    keyword: string;
    matchType: 'exact' | 'contains' | 'regex';
    isEnabled: boolean;
}
export interface DMTemplate {
    messages: DMMessage[];
    delay: number;
}
export interface DMMessage {
    id: string;
    type: 'text' | 'image' | 'link';
    content: string;
    imageUrl?: string;
    linkUrl?: string;
    buttonText?: string;
}
export interface CampaignSettings {
    maxDmsPerDay: number;
    replyDelay: {
        min: number;
        max: number;
    };
    excludeFollowers: boolean;
    excludePreviouslyMessaged: boolean;
    activeHours?: {
        start: string;
        end: string;
        timezone: string;
    };
}
export interface CampaignAnalytics {
    totalComments: number;
    matchedComments: number;
    dmsSent: number;
    dmsDelivered: number;
    dmsFailed: number;
    conversions: number;
}
export interface QueueJob {
    _id: string;
    campaignId: string;
    type: JobType;
    status: JobStatus;
    data: Record<string, unknown>;
    attempts: number;
    maxAttempts: number;
    error?: string;
    scheduledAt: Date;
    processedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
}
export type JobType = 'send_dm' | 'fetch_comments' | 'verify_delivery' | 'sync_posts';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';
export interface ActivityLog {
    _id: string;
    userId: string;
    campaignId?: string;
    type: ActivityType;
    description: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
export type ActivityType = 'campaign_created' | 'campaign_started' | 'campaign_paused' | 'dm_sent' | 'dm_failed' | 'comment_matched' | 'instagram_connected' | 'instagram_disconnected' | 'subscription_changed';
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: PaginationMeta;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    email: string;
    password: string;
    name: string;
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}
export interface PricingPlan {
    id: SubscriptionPlan;
    name: string;
    description: string;
    price: {
        monthly: number;
        yearly: number;
    };
    features: string[];
    limits: {
        campaigns: number;
        instagramAccounts: number;
        dmsPerMonth: number;
        teamMembers: number;
    };
    popular?: boolean;
}
export interface BillingPlan {
    id: Exclude<SubscriptionPlan, 'free'>;
    name: string;
    description: string;
    price: string;
    priceId?: string;
    limits: {
        commentsPerMonth: number;
        dmsPerMonth: number;
        campaigns: number;
        instagramAccounts: number;
    };
    features: string[];
}
export interface BillingUsage {
    commentsProcessed: number;
    dmsSent: number;
    activeCampaigns: number;
    instagramAccounts: number;
}
export interface BillingInvoice {
    id: string;
    number: string | null;
    date: string;
    amount: string;
    status: string | null;
    hostedInvoiceUrl: string | null;
    invoicePdf: string | null;
}
//# sourceMappingURL=index.d.ts.map