import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { campaignController } from './campaign.controller.js';
import { authenticate } from '../auth/auth.middleware.js';
import { validateBody } from '../../middleware/validation.middleware.js';
import { createCampaignSchema, updateCampaignSchema } from './campaign.validation.js';

const router: ExpressRouter = Router();

// All routes require authentication
router.use(authenticate);

// Create campaign
router.post(
  '/',
  validateBody(createCampaignSchema),
  campaignController.createCampaign.bind(campaignController)
);

// Get all campaigns
router.get('/', campaignController.getCampaigns.bind(campaignController));

// Get specific campaign
router.get('/:campaignId', campaignController.getCampaign.bind(campaignController));

// Update campaign
router.patch(
  '/:campaignId',
  validateBody(updateCampaignSchema),
  campaignController.updateCampaign.bind(campaignController)
);

// Delete campaign
router.delete('/:campaignId', campaignController.deleteCampaign.bind(campaignController));

// Start campaign
router.post('/:campaignId/start', campaignController.startCampaign.bind(campaignController));

// Pause campaign
router.post('/:campaignId/pause', campaignController.pauseCampaign.bind(campaignController));

export default router;
