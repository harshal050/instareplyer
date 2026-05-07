import { CampaignModel, ActivityLogModel } from '@instareplyer/database';
import type { CampaignAnalytics } from '@instareplyer/types';
import { NotFoundError } from '../../utils/errors.js';

export class AnalyticsService {
  async getCampaignAnalytics(campaignId: string, userId: string): Promise<CampaignAnalytics> {
    const campaign = await CampaignModel.findOne({ _id: campaignId, userId });

    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }

    return campaign.analytics;
  }

  async getUserAnalytics(userId: string) {
    const campaigns = await CampaignModel.find({ userId }).sort({ updatedAt: -1 });
    const totals = campaigns.reduce(
      (acc, campaign) => {
        acc.totalDmsSent += campaign.analytics.dmsSent;
        acc.totalCommentProcessed += campaign.analytics.totalComments;
        acc.conversions += campaign.analytics.conversions;
        return acc;
      },
      { totalDmsSent: 0, totalCommentProcessed: 0, conversions: 0 }
    );
    const activities = await ActivityLogModel.find({ userId }).sort({ createdAt: -1 }).limit(10);

    return {
      totalDmsSent: totals.totalDmsSent,
      activeCampaigns: campaigns.filter((campaign) => campaign.status === 'active').length,
      totalCommentProcessed: totals.totalCommentProcessed,
      conversionRate:
        totals.totalDmsSent > 0 ? Number(((totals.conversions / totals.totalDmsSent) * 100).toFixed(1)) : 0,
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

  async getDailyStats(campaignId: string, days: number = 7) {
    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      throw new NotFoundError('Campaign not found');
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

export const analyticsService = new AnalyticsService();
