"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Play,
  Pause,
  Pencil,
  Trash2,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useCampaignStore } from "@/lib/stores/campaigns.store";
import { useInstagramStore } from "@/lib/stores/instagram.store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CampaignPost } from "@instareplyer/types";

const statusStyles = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export default function CampaignsPage() {
  const {
    campaigns,
    isLoading,
    fetchCampaigns,
    createCampaign,
    deleteCampaign,
    startCampaign,
    pauseCampaign,
  } = useCampaignStore();
  const { accounts, fetchAccounts, fetchMedia } = useInstagramStore();
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState<CampaignPost[]>([]);
  const [form, setForm] = useState({
    instagramAccountId: "",
    postId: "",
    name: "",
    keyword: "",
    message: "",
  });

  useEffect(() => {
    fetchCampaigns();
    fetchAccounts();
  }, [fetchAccounts, fetchCampaigns]);

  useEffect(() => {
    if (!form.instagramAccountId) return;
    fetchMedia(form.instagramAccountId)
      .then(setPosts)
      .catch((error) => toast.error((error as Error).message || "Failed to load Instagram posts"));
  }, [fetchMedia, form.instagramAccountId]);

  const handleDelete = async (campaignId: string) => {
    try {
      await deleteCampaign(campaignId);
      toast.success("Campaign deleted successfully");
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete campaign");
    }
  };

  const handleStart = async (campaignId: string) => {
    try {
      await startCampaign(campaignId);
      toast.success("Campaign started");
    } catch (error) {
      toast.error((error as Error).message || "Failed to start campaign");
    }
  };

  const handlePause = async (campaignId: string) => {
    try {
      await pauseCampaign(campaignId);
      toast.success("Campaign paused");
    } catch (error) {
      toast.error((error as Error).message || "Failed to pause campaign");
    }
  };

  const handleCreate = async () => {
    const selectedPost = posts.find((post) => post.postId === form.postId);
    if (!selectedPost) {
      toast.error("Select an Instagram post or reel");
      return;
    }

    try {
      await createCampaign({
        instagramAccountId: form.instagramAccountId,
        name: form.name || `Auto reply for ${form.keyword}`,
        triggerType: "keyword",
        status: "draft",
        posts: [selectedPost],
        keywords: [{ keyword: form.keyword, matchType: "contains", isEnabled: true }],
        dmTemplate: {
          delay: 1,
          messages: [{ type: "text", content: form.message }],
        },
        settings: {
          maxDmsPerDay: 100,
          replyDelay: { min: 1, max: 2 },
          excludeFollowers: false,
          excludePreviouslyMessaged: true,
        },
      });
      setShowForm(false);
      setForm({ instagramAccountId: "", postId: "", name: "", keyword: "", message: "" });
      toast.success("Campaign created");
    } catch (error) {
      toast.error((error as Error).message || "Failed to create campaign");
    }
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Campaigns"
        description="Manage your automated DM campaigns"
        action={{ label: "New Campaign", onClick: () => setShowForm((value) => !value) }}
      />

      <div className="p-6">
        {showForm && (
          <div className="mb-6 rounded-xl border border-border bg-card p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={form.instagramAccountId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, instagramAccountId: event.target.value, postId: "" }))
                }
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              >
                <option value="">Select Instagram account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    @{account.username}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Campaign name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
              <Input
                placeholder="Comment keyword, for example INFO"
                value={form.keyword}
                onChange={(event) => setForm((current) => ({ ...current, keyword: event.target.value }))}
              />
              <Input
                placeholder="DM content to send"
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {posts.map((post) => (
                <button
                  key={post.postId}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, postId: post.postId }))}
                  className={cn(
                    "overflow-hidden rounded-lg border bg-background text-left",
                    form.postId === post.postId ? "border-primary" : "border-border"
                  )}
                >
                  {post.thumbnail && (
                    <img src={post.thumbnail} alt="" className="aspect-video w-full object-cover" />
                  )}
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm text-foreground">{post.caption || post.postUrl}</p>
                    <p className="mt-1 text-xs uppercase text-muted-foreground">{post.mediaType}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isLoading || !form.keyword || !form.message}>
                Save Campaign
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20">
            All Campaigns
          </Button>
          <Button variant="outline" size="sm">
            Active
          </Button>
          <Button variant="outline" size="sm">
            Paused
          </Button>
          <Button variant="outline" size="sm">
            Draft
          </Button>
        </div>

        {/* Campaigns Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {campaign.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {campaign.triggerType}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                      statusStyles[campaign.status as keyof typeof statusStyles]
                    )}
                  >
                    {campaign.status}
                  </span>
                </div>

                {/* Keywords */}
                {campaign.keywords.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {campaign.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword.id}
                          className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground"
                        >
                          {keyword.keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">DMs Sent</p>
                      <p className="font-semibold text-foreground">
                        {campaign.analytics.dmsSent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                      <Zap className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conversions</p>
                      <p className="font-semibold text-foreground">
                        {campaign.analytics.conversions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-2">
                  {(campaign.status === 'draft' || campaign.status === 'paused') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStart(campaign._id)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Play className="mr-1 h-3.5 w-3.5" />
                      Start
                    </Button>
                  )}
                  {campaign.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePause(campaign._id)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Pause className="mr-1 h-3.5 w-3.5" />
                      Pause
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(campaign._id)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
