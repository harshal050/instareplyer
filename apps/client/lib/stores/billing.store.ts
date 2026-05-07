import { create } from 'zustand';
import type { BillingInvoice, BillingPlan, BillingUsage, SubscriptionPlan, UserSubscription } from '@instareplyer/types';
import { api } from '../api';

interface BillingOverview {
  plans: BillingPlan[];
  currentPlan: SubscriptionPlan;
  subscription: UserSubscription;
  usage: BillingUsage;
  limits: BillingPlan['limits'];
  invoices: BillingInvoice[];
}

interface BillingState {
  billing: BillingOverview | null;
  isLoading: boolean;
  error: string | null;
  fetchBilling: () => Promise<void>;
  checkout: (plan: Exclude<SubscriptionPlan, 'free'>) => Promise<void>;
  manageBilling: () => Promise<void>;
}

export const useBillingStore = create<BillingState>((set) => ({
  billing: null,
  isLoading: false,
  error: null,

  fetchBilling: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<{ billing: BillingOverview }>('/api/billing');
      set({ billing: data.billing, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  checkout: async (plan) => {
    set({ isLoading: true });
    try {
      const data = await api.post<{ url: string }>('/api/billing/checkout', { plan });
      window.location.href = data.url;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  manageBilling: async () => {
    set({ isLoading: true });
    try {
      const data = await api.post<{ url: string }>('/api/billing/portal');
      window.location.href = data.url;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));
