import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { analyticsController } from './analytics.controller.js';
import { authenticate } from '../auth/auth.middleware.js';

const router: ExpressRouter = Router();

// All routes require authentication
router.use(authenticate);

// Get user overview analytics
router.get('/', analyticsController.getUserAnalytics.bind(analyticsController));

// Get campaign analytics
router.get(
  '/campaign/:campaignId',
  analyticsController.getCampaignAnalytics.bind(analyticsController)
);

// Get daily stats for a campaign
router.get(
  '/campaign/:campaignId/daily',
  analyticsController.getDailyStats.bind(analyticsController)
);

export default router;
