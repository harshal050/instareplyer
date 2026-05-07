import type { BillingInvoice, BillingPlan, BillingUsage, SubscriptionPlan } from '@instareplyer/types';
export declare class BillingService {
    getPlans(): BillingPlan[];
    getOverview(userId: string): Promise<{
        plans: BillingPlan[];
        currentPlan: any;
        subscription: any;
        usage: BillingUsage;
        limits: {
            readonly commentsPerMonth: 1000;
            readonly dmsPerMonth: 1000;
            readonly campaigns: 3;
            readonly instagramAccounts: 1;
        } | {
            readonly commentsPerMonth: 10000;
            readonly dmsPerMonth: 10000;
            readonly campaigns: 10;
            readonly instagramAccounts: 3;
        } | {
            readonly commentsPerMonth: 100000;
            readonly dmsPerMonth: 100000;
            readonly campaigns: 100;
            readonly instagramAccounts: 25;
        } | {
            commentsPerMonth: number;
            dmsPerMonth: number;
            campaigns: number;
            instagramAccounts: number;
        };
        invoices: BillingInvoice[];
    }>;
    createCheckoutSession(userId: string, plan: SubscriptionPlan): Promise<{
        url: string;
    }>;
    createPortalSession(userId: string): Promise<{
        url: string;
    }>;
    syncCheckoutSession(sessionId: string): Promise<void>;
    private getUsage;
    private getLimits;
    private createCustomer;
    private getInvoices;
    private resolvePriceId;
    private formatAmount;
    private stripePost;
    private stripeGet;
    private stripeRequest;
}
export declare const billingService: BillingService;
//# sourceMappingURL=billing.service.d.ts.map