import type { CampaignAnalytics } from '@instareplyer/types';
export declare class AnalyticsService {
    getCampaignAnalytics(campaignId: string, userId: string): Promise<CampaignAnalytics>;
    getUserAnalytics(userId: string): Promise<{
        totalDmsSent: any;
        activeCampaigns: number;
        totalCommentProcessed: any;
        conversionRate: number;
        topCampaigns: {
            id: string;
            name: any;
            dmsDelivered: any;
            conversions: any;
        }[];
        recentActivity: {
            id: string;
            type: any;
            message: any;
            campaign: string;
            time: any;
        }[];
    }>;
    getDailyStats(campaignId: string, days?: number): Promise<{
        date: string;
        dmsSent: number;
        dmsDelivered: number;
        conversions: number;
    }[]>;
}
export declare const analyticsService: AnalyticsService;
//# sourceMappingURL=analytics.service.d.ts.map