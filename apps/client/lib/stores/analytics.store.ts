import { create } from 'zustand';
import type { CampaignAnalytics } from '@instareplyer/types';
import { api } from '../api';

interface AnalyticsState {
  userAnalytics: any | null;
  campaignAnalytics: CampaignAnalytics | null;
  dailyStats: any[] | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUserAnalytics: () => Promise<void>;
  fetchCampaignAnalytics: (campaignId: string) => Promise<void>;
  fetchDailyStats: (campaignId: string, days?: number) => Promise<void>;
  clearError: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  userAnalytics: null,
  campaignAnalytics: null,
  dailyStats: null,
  isLoading: false,
  error: null,

  fetchUserAnalytics: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<{ analytics: any }>('/api/analytics');
      set({ userAnalytics: data.analytics, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCampaignAnalytics: async (campaignId) => {
    set({ isLoading: true });
    try {
      const data = await api.get<{ analytics: CampaignAnalytics }>(
        `/api/analytics/campaign/${campaignId}`
      );
      set({ campaignAnalytics: data.analytics, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDailyStats: async (campaignId, days = 7) => {
    set({ isLoading: true });
    try {
      const data = await api.get<{ stats: any[] }>(
        `/api/analytics/campaign/${campaignId}/daily?days=${days}`
      );
      set({ dailyStats: data.stats, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
