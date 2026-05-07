"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = exports.AnalyticsController = void 0;
const analytics_service_js_1 = require("./analytics.service.js");
const response_js_1 = require("../../utils/response.js");
class AnalyticsController {
    async getCampaignAnalytics(req, res, next) {
        try {
            const analytics = await analytics_service_js_1.analyticsService.getCampaignAnalytics(req.params.campaignId, req.user._id);
            (0, response_js_1.sendSuccess)(res, { analytics });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserAnalytics(_req, res, next) {
        try {
            const analytics = await analytics_service_js_1.analyticsService.getUserAnalytics(_req.user._id);
            (0, response_js_1.sendSuccess)(res, { analytics });
        }
        catch (error) {
            next(error);
        }
    }
    async getDailyStats(req, res, next) {
        try {
            const days = parseInt(req.query.days) || 7;
            const stats = await analytics_service_js_1.analyticsService.getDailyStats(req.params.campaignId, days);
            (0, response_js_1.sendSuccess)(res, { stats });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
exports.analyticsController = new AnalyticsController();
//# sourceMappingURL=analytics.controller.js.map