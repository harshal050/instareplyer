"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useInstagramStore } from "@/lib/stores/instagram.store";
import { toast } from "sonner";

export default function AccountsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accounts, isLoading, fetchAccounts, getConnectUrl, disconnectAccount } = useInstagramStore();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const status = searchParams.get("instagram");
    if (status === "connected") {
      toast.success("Instagram account connected successfully");
      fetchAccounts();
      router.replace("/dashboard/accounts");
    }
    if (status === "error") {
      toast.error(searchParams.get("message") || "Failed to connect Instagram account");
      router.replace("/dashboard/accounts");
    }
  }, [fetchAccounts, router, searchParams]);

  const handleDisconnect = async (accountId: string) => {
    try {
      await disconnectAccount(accountId);
      toast.success("Account disconnected successfully");
    } catch (error) {
      toast.error((error as Error).message || "Failed to disconnect account");
    }
  };

  const handleConnect = async () => {
    try {
      const url = await getConnectUrl();
      window.location.href = url;
    } catch (error) {
      toast.error((error as Error).message || "Failed to connect Instagram account");
    }
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Instagram Accounts"
        description="Connect and manage your Instagram business accounts"
        action={{ label: "Connect Account", onClick: handleConnect }}
      />

      <div className="p-6">
        {/* Connected Accounts */}
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account._id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-4">
                {/* Profile Picture */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
                    {account.profilePicture ? (
                      <img
                        src={account.profilePicture}
                        alt={account.username}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <Instagram className="h-6 w-6 text-foreground" />
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      @{account.username}
                    </h3>
                    {account.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-yellow-500">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Connected on {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDisconnect(account._id)}
                  disabled={isLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Connect New Account Card */}
        <div className="mt-6 rounded-xl border-2 border-dashed border-border bg-card/50 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
                <Instagram className="h-7 w-7 text-foreground" />
              </div>
            </div>
            <h3 className="mt-4 font-semibold text-foreground">
              Connect Another Account
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Connect your Instagram Business or Creator account to start
              automating DM responses. You'll need to have a Facebook Page
              linked to your Instagram account.
            </p>
            <Button className="mt-6" onClick={handleConnect} disabled={isLoading}>
              <Instagram className="mr-2 h-4 w-4" />
              Connect with Instagram
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
