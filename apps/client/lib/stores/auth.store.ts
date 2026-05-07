import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '@instareplyer/types';
import { api } from '../api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuth: () => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const data = await api.post<{ user: User; accessToken: string }>('/api/auth/login', credentials);
          api.setAccessToken(data.accessToken);
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.post<{ user: User; accessToken: string }>('/api/auth/register', data);
          api.setAccessToken(response.accessToken);
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/api/auth/logout');
        } catch {
          // Ignore errors, clear local state anyway
        } finally {
          api.setAccessToken(null);
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
        }
      },

      refreshToken: async () => {
        try {
          const data = await api.post<{ accessToken: string }>('/api/auth/refresh');
          api.setAccessToken(data.accessToken);
          set({ accessToken: data.accessToken });
        } catch {
          // Token refresh failed, clear auth state
          get().clearAuth();
        }
      },

      setUser: (user) => {
        set({ user });
      },

      checkAuth: () => {
        const state = get();
        set({ 
          isLoading: false,
          isAuthenticated: !!(state.accessToken && state.user)
        });
      },

      clearAuth: () => {
        api.setAccessToken(null);
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          api.setAccessToken(state.accessToken);
        }
      },
    }
  )
);
