import type { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service.js';
import { sendSuccess } from '../../utils/response.js';

export class AnalyticsController {
  async getCampaignAnalytics(
    req: Request<{ campaignId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const analytics = await analyticsService.getCampaignAnalytics(
        req.params.campaignId,
        req.user!._id
      );
      sendSuccess(res, { analytics });
    } catch (error) {
      next(error);
    }
  }

  async getUserAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await analyticsService.getUserAnalytics(_req.user!._id);
      sendSuccess(res, { analytics });
    } catch (error) {
      next(error);
    }
  }

  async getDailyStats(
    req: Request<{ campaignId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const stats = await analyticsService.getDailyStats(req.params.campaignId, days);
      sendSuccess(res, { stats });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
