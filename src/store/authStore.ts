// ============================================================================
// Authentication Store - Zustand
// ============================================================================

import { create } from 'zustand';
import type { Admin, AuthTokens, AuthState, LoginCredentials } from '@/types';
import { authApi } from '@/api/auth.api';
import { storage } from '@/utils/storage';

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setAdmin: (admin: Admin) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  admin: null,
  tokens: null,
  isAuthenticated: false,

  // Actions
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await authApi.login(credentials);

      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      };

      // Save to localStorage
      storage.setTokens(tokens);
      storage.setAdmin(response.admin);

      // Update store
      set({
        admin: response.admin,
        tokens,
        isAuthenticated: true,
      });
    } catch (error) {
      set({ admin: null, tokens: null, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      const { tokens } = get();
      if (tokens) {
        await authApi.logout(tokens.accessToken, tokens.refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storage.clearAuthData();
      set({ admin: null, tokens: null, isAuthenticated: false });
    }
  },

  setAdmin: (admin: Admin) => {
    storage.setAdmin(admin);
    set({ admin });
  },

  setTokens: (tokens: AuthTokens) => {
    storage.setTokens(tokens);
    set({ tokens, isAuthenticated: true });
  },

  clearAuth: () => {
    storage.clearAuthData();
    set({ admin: null, tokens: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    const admin = storage.getAdmin();
    const tokens = storage.getTokens();

    if (admin && tokens) {
      set({ admin, tokens, isAuthenticated: true });
    } else {
      set({ admin: null, tokens: null, isAuthenticated: false });
    }
  },
}));
