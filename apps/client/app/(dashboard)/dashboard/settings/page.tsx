"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="p-6">
        <div className="max-w-2xl space-y-8">
          {/* Profile Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Profile Information
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your personal details
            </p>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name || ""}
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  placeholder="john@example.com"
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Password Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Change Password
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your password to keep your account secure
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter your current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter a new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Notifications
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose what notifications you want to receive
            </p>

            <div className="mt-6 space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Email Notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your campaign performance
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Get a weekly summary of your DM automation
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    Campaign Alerts
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when campaigns reach limits or have issues
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
            <h3 className="text-lg font-semibold text-destructive">
              Danger Zone
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Irreversible and destructive actions
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <p className="font-medium text-foreground">
                    Delete All Campaigns
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all your campaigns and their data
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Delete All
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <p className="font-medium text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
