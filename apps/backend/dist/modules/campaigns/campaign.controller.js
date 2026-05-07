"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignController = exports.CampaignController = void 0;
const campaign_service_js_1 = require("./campaign.service.js");
const response_js_1 = require("../../utils/response.js");
class CampaignController {
    async createCampaign(req, res, next) {
        try {
            const campaign = await campaign_service_js_1.campaignService.createCampaign(req.user._id, req.body);
            (0, response_js_1.sendCreated)(res, { campaign });
        }
        catch (error) {
            next(error);
        }
    }
    async getCampaigns(_req, res, next) {
        try {
            const campaigns = await campaign_service_js_1.campaignService.getCampaigns(_req.user._id);
            (0, response_js_1.sendSuccess)(res, { campaigns });
        }
        catch (error) {
            next(error);
        }
    }
    async getCampaign(req, res, next) {
        try {
            const campaign = await campaign_service_js_1.campaignService.getCampaignById(req.params.campaignId, req.user._id);
            (0, response_js_1.sendSuccess)(res, { campaign });
        }
        catch (error) {
            next(error);
        }
    }
    async updateCampaign(req, res, next) {
        try {
            const campaign = await campaign_service_js_1.campaignService.updateCampaign(req.params.campaignId, req.user._id, req.body);
            (0, response_js_1.sendSuccess)(res, { campaign });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteCampaign(req, res, next) {
        try {
            await campaign_service_js_1.campaignService.deleteCampaign(req.params.campaignId, req.user._id);
            (0, response_js_1.sendNoContent)(res);
        }
        catch (error) {
            next(error);
        }
    }
    async startCampaign(req, res, next) {
        try {
            const campaign = await campaign_service_js_1.campaignService.startCampaign(req.params.campaignId, req.user._id);
            (0, response_js_1.sendSuccess)(res, { campaign });
        }
        catch (error) {
            next(error);
        }
    }
    async pauseCampaign(req, res, next) {
        try {
            const campaign = await campaign_service_js_1.campaignService.pauseCampaign(req.params.campaignId, req.user._id);
            (0, response_js_1.sendSuccess)(res, { campaign });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CampaignController = CampaignController;
exports.campaignController = new CampaignController();
//# sourceMappingURL=campaign.controller.js.map