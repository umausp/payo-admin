// ============================================================================
// API Client with Axios Configuration
// ============================================================================

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { storage } from '@/utils/storage';
import type { ApiError } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const tokens = storage.getTokens();
        if (tokens?.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 errors - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = storage.getTokens();
            if (tokens?.refreshToken) {
              // Attempt to refresh token
              const response = await axios.post(
                `${API_BASE_URL}/api/v1/auth/refresh`,
                { refreshToken: tokens.refreshToken }
              );

              const newTokens = response.data;
              storage.setTokens(newTokens);

              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - Clear auth data and redirect to login
            storage.clearAuthData();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle 403 errors - Insufficient permissions
        if (error.response?.status === 403) {
          console.error('Insufficient permissions');
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): ApiError {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || 'An error occurred',
        code: error.response.data?.code,
        details: error.response.data?.details,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Request setup error
      return {
        message: error.message || 'An error occurred',
        code: 'REQUEST_ERROR',
      };
    }
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getInstance();
