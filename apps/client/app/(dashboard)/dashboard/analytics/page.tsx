"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { useCampaignStore } from "@/lib/stores/campaigns.store";
import { useAnalyticsStore } from "@/lib/stores/analytics.store";

export default function AnalyticsPage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const { campaigns, fetchCampaigns } = useCampaignStore();
  const { campaignAnalytics, fetchCampaignAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    if (selectedCampaignId) {
      fetchCampaignAnalytics(selectedCampaignId);
    }
  }, [selectedCampaignId, fetchCampaignAnalytics]);

  // Auto-select first campaign
  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0]._id);
    }
  }, [campaigns, selectedCampaignId]);

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Analytics"
        description="Track your campaign performance and metrics"
      />

      <div className="p-6">
        {/* Campaign Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Campaign
          </label>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground"
          >
            <option value="">Choose a campaign...</option>
            {campaigns.map((campaign) => (
              <option key={campaign._id} value={campaign._id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        {/* Analytics Grid */}
        {campaignAnalytics && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Total Comments</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {campaignAnalytics.totalComments}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Matched Comments</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {campaignAnalytics.matchedComments}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">DMs Sent</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {campaignAnalytics.dmsSent}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">DMs Delivered</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {campaignAnalytics.dmsDelivered}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">DMs Failed</p>
              <p className="mt-2 text-3xl font-bold text-foreground text-destructive">
                {campaignAnalytics.dmsFailed}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Conversions</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {campaignAnalytics.conversions}
              </p>
            </div>
          </div>
        )}

        {!selectedCampaignId && (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">
              Select a campaign to view analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
