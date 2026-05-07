"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_controller_js_1 = require("./campaign.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const validation_middleware_js_1 = require("../../middleware/validation.middleware.js");
const campaign_validation_js_1 = require("./campaign.validation.js");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_js_1.authenticate);
// Create campaign
router.post('/', (0, validation_middleware_js_1.validateBody)(campaign_validation_js_1.createCampaignSchema), campaign_controller_js_1.campaignController.createCampaign.bind(campaign_controller_js_1.campaignController));
// Get all campaigns
router.get('/', campaign_controller_js_1.campaignController.getCampaigns.bind(campaign_controller_js_1.campaignController));
// Get specific campaign
router.get('/:campaignId', campaign_controller_js_1.campaignController.getCampaign.bind(campaign_controller_js_1.campaignController));
// Update campaign
router.patch('/:campaignId', (0, validation_middleware_js_1.validateBody)(campaign_validation_js_1.updateCampaignSchema), campaign_controller_js_1.campaignController.updateCampaign.bind(campaign_controller_js_1.campaignController));
// Delete campaign
router.delete('/:campaignId', campaign_controller_js_1.campaignController.deleteCampaign.bind(campaign_controller_js_1.campaignController));
// Start campaign
router.post('/:campaignId/start', campaign_controller_js_1.campaignController.startCampaign.bind(campaign_controller_js_1.campaignController));
// Pause campaign
router.post('/:campaignId/pause', campaign_controller_js_1.campaignController.pauseCampaign.bind(campaign_controller_js_1.campaignController));
exports.default = router;
//# sourceMappingURL=campaign.routes.js.map