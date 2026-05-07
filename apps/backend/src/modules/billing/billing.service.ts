import { CampaignModel, InstagramAccountModel, UserModel } from '@instareplyer/database';
import type { BillingInvoice, BillingPlan, BillingUsage, SubscriptionPlan } from '@instareplyer/types';
import { env } from '../../config/env.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

const planLimits = {
  starter: { commentsPerMonth: 1000, dmsPerMonth: 1000, campaigns: 3, instagramAccounts: 1 },
  pro: { commentsPerMonth: 10000, dmsPerMonth: 10000, campaigns: 10, instagramAccounts: 3 },
  enterprise: {
    commentsPerMonth: 100000,
    dmsPerMonth: 100000,
    campaigns: 100,
    instagramAccounts: 25,
  },
} as const;

const plans: BillingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For creators starting automation',
    price: '₹2,610.00',
    priceId: env.stripe.prices.starter,
    limits: planLimits.starter,
    features: ['1 Instagram account', '3 active campaigns', '1,000 comments/month', '1,000 DMs/month'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing brands',
    price: '₹7,436.02',
    priceId: env.stripe.prices.pro,
    limits: planLimits.pro,
    features: ['3 Instagram accounts', '10 active campaigns', '10,000 comments/month', '10,000 DMs/month'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and agencies',
    price: '₹18,730.04',
    priceId: env.stripe.prices.enterprise,
    limits: planLimits.enterprise,
    features: ['25 Instagram accounts', '100 active campaigns', '100,000 comments/month', '100,000 DMs/month'],
  },
];

export class BillingService {
  getPlans(): BillingPlan[] {
    return plans;
  }

  async getOverview(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const usage = await this.getUsage(userId);
    const invoices = user.subscription.stripeCustomerId
      ? await this.getInvoices(user.subscription.stripeCustomerId)
      : [];

    return {
      plans,
      currentPlan: user.subscription.plan,
      subscription: user.subscription,
      usage,
      limits: this.getLimits(user.subscription.plan),
      invoices,
    };
  }

  async createCheckoutSession(userId: string, plan: SubscriptionPlan): Promise<{ url: string }> {
    if (plan === 'free') throw new BadRequestError('Free plan does not need checkout');

    const selectedPlan = plans.find((item) => item.id === plan);
    if (!selectedPlan?.priceId) throw new BadRequestError(`Stripe price ID is not configured for ${plan}`);
    const priceId = await this.resolvePriceId(selectedPlan.priceId, plan);

    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const customerId =
      user.subscription.stripeCustomerId || (await this.createCustomer(user.email, user.name, userId));

    user.subscription.stripeCustomerId = customerId;
    await user.save();

    const session = await this.stripePost<{ url: string }>('/v1/checkout/sessions', {
      mode: 'subscription',
      customer: customerId,
      success_url: `${env.clientUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${env.clientUrl}/dashboard/billing?checkout=cancelled`,
      client_reference_id: userId,
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'metadata[userId]': userId,
      'metadata[plan]': plan,
      'subscription_data[metadata][userId]': userId,
      'subscription_data[metadata][plan]': plan,
    });

    return { url: session.url };
  }

  async createPortalSession(userId: string): Promise<{ url: string }> {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    let customerId = user.subscription.stripeCustomerId;
    if (!customerId) {
      customerId = await this.createCustomer(user.email, user.name, userId);
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await this.stripePost<{ url: string }>('/v1/billing_portal/sessions', {
      customer: customerId,
      return_url: `${env.clientUrl}/dashboard/billing`,
    });

    return { url: session.url };
  }

  async syncCheckoutSession(sessionId: string): Promise<void> {
    const session = await this.stripeGet<StripeCheckoutSession>(
      `/v1/checkout/sessions/${sessionId}?expand[]=subscription`
    );
    const userId = session.metadata?.userId || session.client_reference_id;
    const plan = session.metadata?.plan as SubscriptionPlan | undefined;

    if (!userId || !plan || plan === 'free') return;

    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        'subscription.plan': plan,
        'subscription.status': 'active',
        'subscription.stripeCustomerId': session.customer,
        'subscription.stripeSubscriptionId':
          typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
      },
    });
  }

  private async getUsage(userId: string): Promise<BillingUsage> {
    const campaigns = await CampaignModel.find({ userId });
    const instagramAccounts = await InstagramAccountModel.countDocuments({ userId, isActive: true });

    return {
      commentsProcessed: campaigns.reduce((sum, campaign) => sum + campaign.analytics.totalComments, 0),
      dmsSent: campaigns.reduce((sum, campaign) => sum + campaign.analytics.dmsSent, 0),
      activeCampaigns: campaigns.filter((campaign) => campaign.status === 'active').length,
      instagramAccounts,
    };
  }

  private getLimits(plan: SubscriptionPlan) {
    if (plan === 'free') return { commentsPerMonth: 100, dmsPerMonth: 100, campaigns: 1, instagramAccounts: 1 };
    return planLimits[plan];
  }

  private async createCustomer(email: string, name: string, userId: string): Promise<string> {
    const customer = await this.stripePost<{ id: string }>('/v1/customers', {
      email,
      name,
      'metadata[userId]': userId,
    });
    return customer.id;
  }

  private async getInvoices(customerId: string): Promise<BillingInvoice[]> {
    const response = await this.stripeGet<{ data: StripeInvoice[] }>(
      `/v1/invoices?customer=${encodeURIComponent(customerId)}&limit=12`
    );

    return response.data.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      date: new Date(invoice.created * 1000).toISOString(),
      amount: this.formatAmount(invoice.amount_paid || invoice.amount_due, invoice.currency),
      status: invoice.status,
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
    }));
  }

  private async resolvePriceId(configuredId: string, plan: SubscriptionPlan): Promise<string> {
    if (configuredId.startsWith('price_')) return configuredId;
    if (!configuredId.startsWith('prod_')) {
      throw new BadRequestError(`STRIPE_PRICE_${plan.toUpperCase()} must be a Stripe price_ ID`);
    }

    const product = await this.stripeGet<{ default_price?: string | { id?: string } | null }>(
      `/v1/products/${encodeURIComponent(configuredId)}`
    );
    const defaultPrice = typeof product.default_price === 'string' ? product.default_price : product.default_price?.id;
    if (!defaultPrice) {
      throw new BadRequestError(
        `Stripe product ${configuredId} has no default price. Set STRIPE_PRICE_${plan.toUpperCase()} to a price_ ID.`
      );
    }

    return defaultPrice;
  }

  private formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  private async stripePost<T>(path: string, body: Record<string, string>): Promise<T> {
    return this.stripeRequest<T>(path, {
      method: 'POST',
      body: new URLSearchParams(body),
    });
  }

  private async stripeGet<T>(path: string): Promise<T> {
    return this.stripeRequest<T>(path, { method: 'GET' });
  }

  private async stripeRequest<T>(path: string, init: RequestInit): Promise<T> {
    if (!env.stripe.secretKey) throw new BadRequestError('STRIPE_SECRET_KEY must be set in .env.local');

    const response = await fetch(`https://api.stripe.com${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${env.stripe.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = (await response.json()) as T & { error?: { message?: string } };

    if (!response.ok || data.error) {
      throw new BadRequestError(data.error?.message || 'Stripe request failed');
    }

    return data;
  }
}

interface StripeInvoice {
  id: string;
  number: string | null;
  created: number;
  currency: string;
  amount_paid: number;
  amount_due: number;
  status: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
}

interface StripeCheckoutSession {
  customer: string;
  client_reference_id: string | null;
  metadata?: Record<string, string>;
  subscription?: string | { id: string };
}

export const billingService = new BillingService();
