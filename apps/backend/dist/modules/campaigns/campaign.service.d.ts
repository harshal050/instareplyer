import type { Campaign } from '@instareplyer/types';
import type { CreateCampaignInput, UpdateCampaignInput } from './campaign.validation.js';
export declare class CampaignService {
    createCampaign(userId: string, data: CreateCampaignInput): Promise<Campaign>;
    getCampaigns(userId: string): Promise<Campaign[]>;
    getCampaignById(campaignId: string, userId: string): Promise<Campaign>;
    updateCampaign(campaignId: string, userId: string, data: UpdateCampaignInput): Promise<Campaign>;
    deleteCampaign(campaignId: string, userId: string): Promise<void>;
    startCampaign(campaignId: string, userId: string): Promise<Campaign>;
    pauseCampaign(campaignId: string, userId: string): Promise<Campaign>;
    processCommentForActiveCampaign(data: ProcessCampaignCommentInput, sendPrivateReply: PrivateReplySender, userId?: string): Promise<ProcessCampaignCommentResult>;
    private markCommentProcessed;
    private commentMatchesCampaign;
    private sanitizeCampaign;
}
export interface ProcessCampaignCommentInput {
    postId: string;
    commentId: string;
    text: string;
}
export interface ProcessCampaignCommentResult {
    matched: boolean;
    sent: boolean;
    campaignId?: string;
    instagramAccountId?: string;
}
type PrivateReplySender = (commentId: string, message: string, accessToken: string, instagramUserId: string) => Promise<void>;
export declare const campaignService: CampaignService;
export {};
//# sourceMappingURL=campaign.service.d.ts.map