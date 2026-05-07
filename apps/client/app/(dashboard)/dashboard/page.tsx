"use client";

import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  MessageSquare,
  Users,
  Megaphone,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useAnalyticsStore } from "@/lib/stores/analytics.store";
import { useCampaignStore } from "@/lib/stores/campaigns.store";

export default function DashboardPage() {
  const { userAnalytics, fetchUserAnalytics } = useAnalyticsStore();
  const { campaigns, fetchCampaigns } = useCampaignStore();

  useEffect(() => {
    fetchUserAnalytics();
    fetchCampaigns();
  }, [fetchUserAnalytics, fetchCampaigns]);

  const stats = [
    {
      title: "Total DMs Sent",
      value: userAnalytics?.totalDmsSent || "0",
      change: { value: 12.5, label: "vs last month" },
      icon: MessageSquare,
      iconClassName: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Active Campaigns",
      value: campaigns.filter(c => c.status === 'active').length || "0",
      change: { value: 2, label: "new this week" },
      icon: Megaphone,
      iconClassName: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "Comments Processed",
      value: userAnalytics?.totalCommentProcessed || "0",
      change: { value: 23.1, label: "vs last month" },
      icon: Activity,
      iconClassName: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Conversion Rate",
      value: userAnalytics?.conversionRate ? `${userAnalytics.conversionRate}%` : "0%",
      change: { value: 4.3, label: "vs last month" },
      icon: TrendingUp,
      iconClassName: "bg-green-500/10 text-green-500",
    },
  ];

  const recentActivity = userAnalytics?.recentActivity || [];

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your campaigns."
        action={{ label: "New Campaign", onClick: () => {} }}
      />

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <p className="font-medium text-foreground">{activity.message}</p>
                  <p className="text-sm text-muted-foreground">{activity.campaign}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
