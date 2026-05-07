"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_js_1 = require("./analytics.controller.js");
const auth_middleware_js_1 = require("../auth/auth.middleware.js");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_js_1.authenticate);
// Get user overview analytics
router.get('/', analytics_controller_js_1.analyticsController.getUserAnalytics.bind(analytics_controller_js_1.analyticsController));
// Get campaign analytics
router.get('/campaign/:campaignId', analytics_controller_js_1.analyticsController.getCampaignAnalytics.bind(analytics_controller_js_1.analyticsController));
// Get daily stats for a campaign
router.get('/campaign/:campaignId/daily', analytics_controller_js_1.analyticsController.getDailyStats.bind(analytics_controller_js_1.analyticsController));
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map