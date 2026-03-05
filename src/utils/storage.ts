// ============================================================================
// Storage Utilities
// ============================================================================

import type { AuthTokens, Admin } from '@/types';
import { TOKEN_STORAGE_KEY, ADMIN_STORAGE_KEY } from './constants';

export const storage = {
  // Token Management
  setTokens(tokens: AuthTokens): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to save tokens:', error);
    }
  },

  getTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem(TOKEN_STORAGE_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return null;
    }
  },

  removeTokens(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove tokens:', error);
    }
  },

  // Admin Data Management
  setAdmin(admin: Admin): void {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    } catch (error) {
      console.error('Failed to save admin data:', error);
    }
  },

  getAdmin(): Admin | null {
    try {
      const admin = localStorage.getItem(ADMIN_STORAGE_KEY);
      return admin ? JSON.parse(admin) : null;
    } catch (error) {
      console.error('Failed to retrieve admin data:', error);
      return null;
    }
  },

  removeAdmin(): void {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove admin data:', error);
    }
  },

  // Clear All Auth Data
  clearAuthData(): void {
    this.removeTokens();
    this.removeAdmin();
  },
};
