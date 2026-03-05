// ============================================================================
// Authentication API
// ============================================================================

import axios from 'axios';
import { AUTH_SERVICE_URL } from '@/utils/constants';
import type { LoginCredentials, AuthTokens, Admin } from '@/types';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  admin: Admin;
}

export const authApi = {
  /**
   * Admin login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${AUTH_SERVICE_URL}/api/v1/admin/login`,
      credentials
    );
    return response.data;
  },

  /**
   * Refresh access token
   */
  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await axios.post<AuthTokens>(
      `${AUTH_SERVICE_URL}/api/v1/auth/refresh`,
      { refreshToken }
    );
    return response.data;
  },

  /**
   * Logout admin
   */
  logout: async (accessToken?: string, refreshToken?: string): Promise<void> => {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    await axios.post(
      `${AUTH_SERVICE_URL}/api/v1/auth/logout`,
      { refreshToken },
      { headers }
    );
  },
};
