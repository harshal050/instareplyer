"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsService = exports.AnalyticsService = void 0;
const database_1 = require("@instareplyer/database");
const errors_js_1 = require("../../utils/errors.js");
class AnalyticsService {
    async getCampaignAnalytics(campaignId, userId) {
        const campaign = await database_1.CampaignModel.findOne({ _id: campaignId, userId });
        if (!campaign) {
            throw new errors_js_1.NotFoundError('Campaign not found');
        }
        return campaign.analytics;
    }
    async getUserAnalytics(userId) {
        const campaigns = await database_1.CampaignModel.find({ userId }).sort({ updatedAt: -1 });
        const totals = campaigns.reduce((acc, campaign) => {
            acc.totalDmsSent += campaign.analytics.dmsSent;
            acc.totalCommentProcessed += campaign.analytics.totalComments;
            acc.conversions += campaign.analytics.conversions;
            return acc;
        }, { totalDmsSent: 0, totalCommentProcessed: 0, conversions: 0 });
        const activities = await database_1.ActivityLogModel.find({ userId }).sort({ createdAt: -1 }).limit(10);
        return {
            totalDmsSent: totals.totalDmsSent,
            activeCampaigns: campaigns.filter((campaign) => campaign.status === 'active').length,
            totalCommentProcessed: totals.totalCommentProcessed,
            conversionRate: totals.totalDmsSent > 0 ? Number(((totals.conversions / totals.totalDmsSent) * 100).toFixed(1)) : 0,
            topCampaigns: campaigns.slice(0, 5).map((campaign) => ({
                id: String(campaign._id),
                name: campaign.name,
                dmsDelivered: campaign.analytics.dmsDelivered,
                conversions: campaign.analytics.conversions,
            })),
            recentActivity: activities.map((activity) => ({
                id: String(activity._id),
                type: activity.type,
                message: activity.description,
                campaign: activity.campaignId ? String(activity.campaignId) : 'Account',
                time: activity.createdAt,
            })),
        };
    }
    async getDailyStats(campaignId, days = 7) {
        const campaign = await database_1.CampaignModel.findById(campaignId);
        if (!campaign) {
            throw new errors_js_1.NotFoundError('Campaign not found');
        }
        const stats = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const weight = days > 1 ? (days - i) / days : 1;
            stats.push({
                date: date.toISOString().split('T')[0],
                dmsSent: Math.round(campaign.analytics.dmsSent * weight),
                dmsDelivered: Math.round(campaign.analytics.dmsDelivered * weight),
                conversions: Math.round(campaign.analytics.conversions * weight),
            });
        }
        return stats;
    }
}
exports.AnalyticsService = AnalyticsService;
exports.analyticsService = new AnalyticsService();
//# sourceMappingURL=analytics.service.js.map