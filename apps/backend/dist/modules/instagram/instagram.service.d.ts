import type { CampaignPost, InstagramAccount } from '@instareplyer/types';
import type { ConnectInstagramInput, UpdateInstagramAccountInput } from './instagram.validation.js';
export declare class InstagramService {
    private lastMessageAt;
    private pollTimer?;
    private isPolling;
    getOAuthUrl(userId: string): string;
    connectFromOAuth(code: string, state: string): Promise<InstagramAccount>;
    connectAccount(userId: string, data: ConnectInstagramInput): Promise<InstagramAccount>;
    connectConfiguredAccount(userId: string): Promise<InstagramAccount>;
    getMedia(accountId: string, userId: string): Promise<CampaignPost[]>;
    getAccounts(userId: string): Promise<InstagramAccount[]>;
    getAccountById(accountId: string, userId: string): Promise<InstagramAccount>;
    updateAccount(accountId: string, userId: string, data: UpdateInstagramAccountInput): Promise<InstagramAccount>;
    disconnectAccount(accountId: string, userId: string): Promise<void>;
    processComment(userId: string, data: ProcessCommentInput): Promise<ProcessCommentResult>;
    processWebhookPayload(payload: InstagramWebhookPayload): Promise<WebhookProcessResult>;
    startCommentPolling(): void;
    stopCommentPolling(): void;
    pollActiveCampaignComments(): Promise<PollCommentsResult>;
    private waitForMessageSlot;
    private extractCommentEvents;
    private fetchRecentComments;
    private sendPrivateReply;
    private formatGraphError;
    private fetchInstagramProfile;
    private getRedirectUri;
    private verifyOAuthState;
    private exchangeCodeForAccessToken;
    private exchangeForLongLivedToken;
    private findInstagramPage;
    private facebookGet;
    private mapMediaType;
    private sanitizeAccount;
}
interface ProcessCommentInput {
    postId: string;
    commentId: string;
    text: string;
}
interface ProcessCommentResult {
    matched: boolean;
    sent: boolean;
    campaignId?: string;
}
interface WebhookProcessResult {
    received: number;
    processed: number;
    matched: number;
    sent: number;
    ignored: number;
    errors: string[];
}
interface PollCommentsResult {
    campaigns: number;
    posts: number;
    comments: number;
    matched: number;
    sent: number;
    skipped: boolean;
    errors: string[];
}
interface InstagramWebhookPayload {
    entry?: Array<{
        changes?: Array<{
            field?: string;
            value?: {
                id?: string;
                comment_id?: string;
                media?: {
                    id?: string;
                };
                media_id?: string;
                post_id?: string;
                text?: string;
                message?: string;
            };
        }>;
    }>;
}
export declare const instagramService: InstagramService;
export {};
//# sourceMappingURL=instagram.service.d.ts.map