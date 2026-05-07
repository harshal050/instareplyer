"use client";

import { useEffect } from "react";
import { Check, CreditCard, Download } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { useBillingStore } from "@/lib/stores/billing.store";
import { cn } from "@/lib/utils";

function usagePercent(used: number, limit: number) {
  if (!limit) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export default function BillingPage() {
  const { billing, isLoading, fetchBilling, checkout, manageBilling } = useBillingStore();

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  const handleCheckout = async (plan: "starter" | "pro" | "enterprise") => {
    try {
      await checkout(plan);
    } catch (error) {
      toast.error((error as Error).message || "Unable to start checkout");
    }
  };

  const handleManage = async () => {
    try {
      await manageBilling();
    } catch (error) {
      toast.error((error as Error).message || "Unable to open Stripe portal");
    }
  };

  const usage = billing?.usage;
  const limits = billing?.limits;

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Billing" description="Manage subscription, usage, invoices, and payment method" />

      <div className="p-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold capitalize text-foreground">
                  {billing?.currentPlan || "free"}
                </span>
                <span className="text-muted-foreground">
                  {billing?.subscription.status || "active"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleManage} disabled={isLoading}>
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Account
              </Button>
            </div>
          </div>

          {usage && limits && (
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                ["Comments", usage.commentsProcessed, limits.commentsPerMonth],
                ["DMs", usage.dmsSent, limits.dmsPerMonth],
                ["Campaigns", usage.activeCampaigns, limits.campaigns],
                ["Accounts", usage.instagramAccounts, limits.instagramAccounts],
              ].map(([label, used, limit]) => (
                <div key={label} className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">{label} Used</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">{used}</span>
                    <span className="text-sm text-muted-foreground">/ {limit}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${usagePercent(Number(used), Number(limit))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground">Available Plans</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {billing?.plans.map((plan) => {
              const isCurrent = billing.currentPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={cn("rounded-xl border bg-card p-6", isCurrent ? "border-primary" : "border-border")}
                >
                  <h4 className="font-semibold text-foreground">{plan.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || isLoading}
                    onClick={() => handleCheckout(plan.id)}
                  >
                    {isCurrent ? "Current Plan" : "Select Plan"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card">
          <div className="border-b border-border p-6">
            <h3 className="text-lg font-semibold text-foreground">Billing History</h3>
          </div>
          <div className="divide-y divide-border">
            {billing?.invoices.length ? (
              billing.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span className="font-mono text-sm text-muted-foreground">
                      {invoice.number || invoice.id}
                    </span>
                    <span className="text-sm text-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">{invoice.amount}</span>
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                      {invoice.status || "open"}
                    </span>
                    {invoice.invoicePdf && (
                      <a
                        href={invoice.invoicePdf}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-sm text-muted-foreground">No invoices yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
