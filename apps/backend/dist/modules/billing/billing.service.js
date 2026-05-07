"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingService = exports.BillingService = void 0;
const database_1 = require("@instareplyer/database");
const env_js_1 = require("../../config/env.js");
const errors_js_1 = require("../../utils/errors.js");
const planLimits = {
    starter: { commentsPerMonth: 1000, dmsPerMonth: 1000, campaigns: 3, instagramAccounts: 1 },
    pro: { commentsPerMonth: 10000, dmsPerMonth: 10000, campaigns: 10, instagramAccounts: 3 },
    enterprise: {
        commentsPerMonth: 100000,
        dmsPerMonth: 100000,
        campaigns: 100,
        instagramAccounts: 25,
    },
};
const plans = [
    {
        id: 'starter',
        name: 'Starter',
        description: 'For creators starting automation',
        price: '₹2,610.00',
        priceId: env_js_1.env.stripe.prices.starter,
        limits: planLimits.starter,
        features: ['1 Instagram account', '3 active campaigns', '1,000 comments/month', '1,000 DMs/month'],
    },
    {
        id: 'pro',
        name: 'Pro',
        description: 'For growing brands',
        price: '₹7,436.02',
        priceId: env_js_1.env.stripe.prices.pro,
        limits: planLimits.pro,
        features: ['3 Instagram accounts', '10 active campaigns', '10,000 comments/month', '10,000 DMs/month'],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For teams and agencies',
        price: '₹18,730.04',
        priceId: env_js_1.env.stripe.prices.enterprise,
        limits: planLimits.enterprise,
        features: ['25 Instagram accounts', '100 active campaigns', '100,000 comments/month', '100,000 DMs/month'],
    },
];
class BillingService {
    getPlans() {
        return plans;
    }
    async getOverview(userId) {
        const user = await database_1.UserModel.findById(userId);
        if (!user)
            throw new errors_js_1.NotFoundError('User not found');
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
    async createCheckoutSession(userId, plan) {
        if (plan === 'free')
            throw new errors_js_1.BadRequestError('Free plan does not need checkout');
        const selectedPlan = plans.find((item) => item.id === plan);
        if (!selectedPlan?.priceId)
            throw new errors_js_1.BadRequestError(`Stripe price ID is not configured for ${plan}`);
        const priceId = await this.resolvePriceId(selectedPlan.priceId, plan);
        const user = await database_1.UserModel.findById(userId);
        if (!user)
            throw new errors_js_1.NotFoundError('User not found');
        const customerId = user.subscription.stripeCustomerId || (await this.createCustomer(user.email, user.name, userId));
        user.subscription.stripeCustomerId = customerId;
        await user.save();
        const session = await this.stripePost('/v1/checkout/sessions', {
            mode: 'subscription',
            customer: customerId,
            success_url: `${env_js_1.env.clientUrl}/dashboard/billing?checkout=success`,
            cancel_url: `${env_js_1.env.clientUrl}/dashboard/billing?checkout=cancelled`,
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
    async createPortalSession(userId) {
        const user = await database_1.UserModel.findById(userId);
        if (!user)
            throw new errors_js_1.NotFoundError('User not found');
        let customerId = user.subscription.stripeCustomerId;
        if (!customerId) {
            customerId = await this.createCustomer(user.email, user.name, userId);
            user.subscription.stripeCustomerId = customerId;
            await user.save();
        }
        const session = await this.stripePost('/v1/billing_portal/sessions', {
            customer: customerId,
            return_url: `${env_js_1.env.clientUrl}/dashboard/billing`,
        });
        return { url: session.url };
    }
    async syncCheckoutSession(sessionId) {
        const session = await this.stripeGet(`/v1/checkout/sessions/${sessionId}?expand[]=subscription`);
        const userId = session.metadata?.userId || session.client_reference_id;
        const plan = session.metadata?.plan;
        if (!userId || !plan || plan === 'free')
            return;
        await database_1.UserModel.findByIdAndUpdate(userId, {
            $set: {
                'subscription.plan': plan,
                'subscription.status': 'active',
                'subscription.stripeCustomerId': session.customer,
                'subscription.stripeSubscriptionId': typeof session.subscription === 'string' ? session.subscription : session.subscription?.id,
            },
        });
    }
    async getUsage(userId) {
        const campaigns = await database_1.CampaignModel.find({ userId });
        const instagramAccounts = await database_1.InstagramAccountModel.countDocuments({ userId, isActive: true });
        return {
            commentsProcessed: campaigns.reduce((sum, campaign) => sum + campaign.analytics.totalComments, 0),
            dmsSent: campaigns.reduce((sum, campaign) => sum + campaign.analytics.dmsSent, 0),
            activeCampaigns: campaigns.filter((campaign) => campaign.status === 'active').length,
            instagramAccounts,
        };
    }
    getLimits(plan) {
        if (plan === 'free')
            return { commentsPerMonth: 100, dmsPerMonth: 100, campaigns: 1, instagramAccounts: 1 };
        return planLimits[plan];
    }
    async createCustomer(email, name, userId) {
        const customer = await this.stripePost('/v1/customers', {
            email,
            name,
            'metadata[userId]': userId,
        });
        return customer.id;
    }
    async getInvoices(customerId) {
        const response = await this.stripeGet(`/v1/invoices?customer=${encodeURIComponent(customerId)}&limit=12`);
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
    async resolvePriceId(configuredId, plan) {
        if (configuredId.startsWith('price_'))
            return configuredId;
        if (!configuredId.startsWith('prod_')) {
            throw new errors_js_1.BadRequestError(`STRIPE_PRICE_${plan.toUpperCase()} must be a Stripe price_ ID`);
        }
        const product = await this.stripeGet(`/v1/products/${encodeURIComponent(configuredId)}`);
        const defaultPrice = typeof product.default_price === 'string' ? product.default_price : product.default_price?.id;
        if (!defaultPrice) {
            throw new errors_js_1.BadRequestError(`Stripe product ${configuredId} has no default price. Set STRIPE_PRICE_${plan.toUpperCase()} to a price_ ID.`);
        }
        return defaultPrice;
    }
    formatAmount(amount, currency) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    }
    async stripePost(path, body) {
        return this.stripeRequest(path, {
            method: 'POST',
            body: new URLSearchParams(body),
        });
    }
    async stripeGet(path) {
        return this.stripeRequest(path, { method: 'GET' });
    }
    async stripeRequest(path, init) {
        if (!env_js_1.env.stripe.secretKey)
            throw new errors_js_1.BadRequestError('STRIPE_SECRET_KEY must be set in .env.local');
        const response = await fetch(`https://api.stripe.com${path}`, {
            ...init,
            headers: {
                Authorization: `Bearer ${env_js_1.env.stripe.secretKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const data = (await response.json());
        if (!response.ok || data.error) {
            throw new errors_js_1.BadRequestError(data.error?.message || 'Stripe request failed');
        }
        return data;
    }
}
exports.BillingService = BillingService;
exports.billingService = new BillingService();
//# sourceMappingURL=billing.service.js.map