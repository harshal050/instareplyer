import { create } from 'zustand';
import type { CampaignPost, InstagramAccount } from '@instareplyer/types';
import { api } from '../api';

interface InstagramState {
  accounts: InstagramAccount[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAccounts: () => Promise<void>;
  getConnectUrl: () => Promise<string>;
  connectAccount: (accountData: {
    accessToken: string;
    instagramUserId: string;
    username: string;
    profilePicture?: string;
  }) => Promise<void>;
  updateAccount: (accountId: string, data: any) => Promise<void>;
  disconnectAccount: (accountId: string) => Promise<void>;
  fetchMedia: (accountId: string) => Promise<CampaignPost[]>;
  clearError: () => void;
}

export const useInstagramStore = create<InstagramState>((set) => ({
  accounts: [],
  isLoading: false,
  error: null,

  fetchAccounts: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<{ accounts: InstagramAccount[] }>('/api/instagram');
      set({ accounts: data.accounts, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  getConnectUrl: async () => {
    const data = await api.get<{ url: string }>('/api/instagram/oauth/url');
    return data.url;
  },

  connectAccount: async (accountData) => {
    set({ isLoading: true });
    try {
      const data = await api.post<{ account: InstagramAccount }>('/api/instagram/connect', accountData);
      set((state) => ({
        accounts: [...state.accounts, data.account],
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMedia: async (accountId) => {
    set({ isLoading: true });
    try {
      const data = await api.get<{ posts: CampaignPost[] }>(`/api/instagram/${accountId}/media`);
      set({ error: null });
      return data.posts;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAccount: async (accountId, updateData) => {
    set({ isLoading: true });
    try {
      const data = await api.patch<{ account: InstagramAccount }>(
        `/api/instagram/${accountId}`,
        updateData
      );
      set((state) => ({
        accounts: state.accounts.map((acc) =>
          acc._id === accountId ? data.account : acc
        ),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  disconnectAccount: async (accountId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/api/instagram/${accountId}`);
      set((state) => ({
        accounts: state.accounts.filter((acc) => acc._id !== accountId),
        error: null,
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
