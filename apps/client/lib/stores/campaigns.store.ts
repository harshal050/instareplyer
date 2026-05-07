import { create } from 'zustand';
import type { Campaign } from '@instareplyer/types';
import { api } from '../api';

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCampaigns: () => Promise<void>;
  fetchCampaign: (campaignId: string) => Promise<void>;
  createCampaign: (data: any) => Promise<Campaign>;
  updateCampaign: (campaignId: string, data: any) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  startCampaign: (campaignId: string) => Promise<void>;
  pauseCampaign: (campaignId: string) => Promise<void>;
  clearError: () => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<{ campaigns: Campaign[] }>('/api/campaigns');
      set({ campaigns: data.campaigns, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCampaign: async (campaignId) => {
    set({ isLoading: true });
    try {
      const data = await api.get<{ campaign: Campaign }>(`/api/campaigns/${campaignId}`);
      set({ currentCampaign: data.campaign, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createCampaign: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post<{ campaign: Campaign }>('/api/campaigns', data);
      set((state) => ({
        campaigns: [...state.campaigns, response.campaign],
        error: null,
      }));
      return response.campaign;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCampaign: async (campaignId, updateData) => {
    set({ isLoading: true });
    try {
      const data = await api.patch<{ campaign: Campaign }>(
        `/api/campaigns/${campaignId}`,
        updateData
      );
      set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c._id === campaignId ? data.campaign : c
        ),
        currentCampaign: state.currentCampaign?._id === campaignId ? data.campaign : state.currentCampaign,
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCampaign: async (campaignId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/api/campaigns/${campaignId}`);
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c._id !== campaignId),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  startCampaign: async (campaignId) => {
    try {
      const data = await api.post<{ campaign: Campaign }>(
        `/api/campaigns/${campaignId}/start`
      );
      set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c._id === campaignId ? data.campaign : c
        ),
        currentCampaign: state.currentCampaign?._id === campaignId ? data.campaign : state.currentCampaign,
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  pauseCampaign: async (campaignId) => {
    try {
      const data = await api.post<{ campaign: Campaign }>(
        `/api/campaigns/${campaignId}/pause`
      );
      set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c._id === campaignId ? data.campaign : c
        ),
        currentCampaign: state.currentCampaign?._id === campaignId ? data.campaign : state.currentCampaign,
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
