import type { Request, Response, NextFunction } from 'express';
export declare class AnalyticsController {
    getCampaignAnalytics(req: Request<{
        campaignId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
    getUserAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void>;
    getDailyStats(req: Request<{
        campaignId: string;
    }>, res: Response, next: NextFunction): Promise<void>;
}
export declare const analyticsController: AnalyticsController;
//# sourceMappingURL=analytics.controller.d.ts.map