// ============================================================================
// Admin API - Dashboard, Users, Merchants, Payments, Audit
// ============================================================================

import { apiClient } from './client';
import type {
  Admin,
  User,
  Merchant,
  PaymentTransaction,
  AuditLog,
  DashboardMetrics,
  PaymentStatistics,
  MerchantStats,
  PaginatedResponse,
  QueryFilters,
} from '@/types';

const BASE_PATH = '/api/v1/admin';

// Helper function to transform paginated responses
function transformPaginatedResponse<T>(apiResponse: any): PaginatedResponse<T> {
  const { users, merchants, data: items, total, limit, skip } = apiResponse;
  const dataArray = users || merchants || items || [];
  const currentLimit = limit || 20;
  const currentTotal = total || 0;
  const currentPage = skip ? Math.floor(skip / currentLimit) + 1 : 1;

  return {
    data: dataArray,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total: currentTotal,
      totalPages: Math.ceil(currentTotal / currentLimit),
    },
  };
}

export const adminApi = {
  // ============ Dashboard ============
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await apiClient.get<{ metrics: any }>(
      `${BASE_PATH}/dashboard/metrics`
    );

    // Transform API response to expected format
    const metrics = response.data.metrics || {};
    return {
      totalUsers: metrics.totalUsers || 0,
      totalMerchants: metrics.totalMerchants || 0,
      activeMerchants: metrics.activeMerchants || 0,
      pendingKyc: metrics.pendingKYC || 0,
      totalTransactions: metrics.totalPayments || 0,
      totalVolume: '0', // Not provided by API yet
      transactionsToday: 0, // Not provided by API yet
      volumeToday: '0', // Not provided by API yet
    };
  },

  getDashboardActivity: async (): Promise<AuditLog[]> => {
    try {
      const response = await apiClient.get<{ activity?: AuditLog[] }>(
        `${BASE_PATH}/dashboard/activity`
      );
      return response.data.activity || [];
    } catch (error) {
      console.error('Failed to fetch dashboard activity:', error);
      return [];
    }
  },

  getPaymentStatistics: async (): Promise<PaymentStatistics> => {
    try {
      const response = await apiClient.get<{ statistics?: any }>(
        `${BASE_PATH}/dashboard/payments`
      );
      const stats = response.data.statistics || {};
      return {
        totalCount: stats.totalCount || 0,
        totalVolume: stats.totalVolume || '0',
        successRate: stats.successRate || 0,
        averageAmount: stats.averageAmount || '0',
        byStatus: stats.byStatus || [],
        recentTrends: stats.recentTrends || [],
      };
    } catch (error) {
      console.error('Failed to fetch payment statistics:', error);
      return {
        totalCount: 0,
        totalVolume: '0',
        successRate: 0,
        averageAmount: '0',
        byStatus: [],
        recentTrends: [],
      };
    }
  },

  // ============ Users ============
  getUsers: async (filters: QueryFilters = {}): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<any>(
      `${BASE_PATH}/users`,
      { params: filters }
    );

    // Transform API response to match expected format
    return transformPaginatedResponse<User>(response.data);
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get<{ user: User }>(
      `${BASE_PATH}/users/${userId}`
    );
    return response.data.user || response.data;
  },

  getUserTransactions: async (
    userId: string,
    filters: QueryFilters = {}
  ): Promise<PaginatedResponse<PaymentTransaction>> => {
    const response = await apiClient.get<any>(
      `${BASE_PATH}/users/${userId}/transactions`,
      { params: filters }
    );
    return transformPaginatedResponse<PaymentTransaction>(response.data);
  },

  blockUser: async (userId: string, reason?: string): Promise<void> => {
    await apiClient.post(`${BASE_PATH}/users/${userId}/block`, { reason });
  },

  unblockUser: async (userId: string): Promise<void> => {
    await apiClient.post(`${BASE_PATH}/users/${userId}/unblock`);
  },

  // ============ Merchants ============
  getMerchants: async (
    filters: QueryFilters = {}
  ): Promise<PaginatedResponse<Merchant>> => {
    const response = await apiClient.get<any>(
      `${BASE_PATH}/merchants`,
      { params: filters }
    );
    return transformPaginatedResponse<Merchant>(response.data);
  },

  getMerchantById: async (merchantId: string): Promise<Merchant> => {
    const response = await apiClient.get<{ merchant: Merchant }>(
      `${BASE_PATH}/merchants/${merchantId}`
    );
    return response.data.merchant || response.data;
  },

  getMerchantStats: async (merchantId: string): Promise<MerchantStats> => {
    try {
      const response = await apiClient.get<{ stats?: MerchantStats }>(
        `${BASE_PATH}/merchants/${merchantId}/stats`
      );
      return response.data.stats || {
        totalTransactions: 0,
        totalVolume: '0',
        successRate: 0,
        averageTransactionAmount: '0',
        recentActivity: [],
      };
    } catch (error) {
      console.error('Failed to fetch merchant stats:', error);
      return {
        totalTransactions: 0,
        totalVolume: '0',
        successRate: 0,
        averageTransactionAmount: '0',
        recentActivity: [],
      };
    }
  },

  approveKyc: async (merchantId: string): Promise<void> => {
    await apiClient.post(`${BASE_PATH}/merchants/${merchantId}/kyc/approve`);
  },

  rejectKyc: async (merchantId: string, reason: string): Promise<void> => {
    await apiClient.post(`${BASE_PATH}/merchants/${merchantId}/kyc/reject`, {
      reason,
    });
  },

  activateMerchant: async (merchantId: string): Promise<void> => {
    await apiClient.post(`${BASE_PATH}/merchants/${merchantId}/activate`);
  },

  deactivateMerchant: async (merchantId: string, reason?: string): Promise<void> => {
    await apiClient.post(`${BASE_PATH}/merchants/${merchantId}/deactivate`, {
      reason,
    });
  },

  // ============ Admins ============
  getAdmins: async (filters: QueryFilters = {}): Promise<PaginatedResponse<Admin>> => {
    const response = await apiClient.get<PaginatedResponse<Admin>>(
      `${BASE_PATH}/admins`,
      { params: filters }
    );
    return response.data;
  },

  getAdminById: async (adminId: string): Promise<Admin> => {
    const response = await apiClient.get<Admin>(`${BASE_PATH}/admins/${adminId}`);
    return response.data;
  },

  getAdminActivity: async (
    adminId: string,
    filters: QueryFilters = {}
  ): Promise<PaginatedResponse<AuditLog>> => {
    const response = await apiClient.get<PaginatedResponse<AuditLog>>(
      `${BASE_PATH}/admins/${adminId}/activity`,
      { params: filters }
    );
    return response.data;
  },

  updateAdmin: async (
    adminId: string,
    data: Partial<Admin>
  ): Promise<Admin> => {
    const response = await apiClient.put<Admin>(
      `${BASE_PATH}/admins/${adminId}`,
      data
    );
    return response.data;
  },

  activateAdmin: async (adminId: string): Promise<void> => {
    await apiClient.post(`${BASE_PATH}/admins/${adminId}/activate`);
  },

  deactivateAdmin: async (adminId: string): Promise<void> => {
    await apiClient.post(`${BASE_PATH}/admins/${adminId}/deactivate`);
  },

  // ============ Audit Logs ============
  getAuditLogs: async (
    filters: QueryFilters = {}
  ): Promise<PaginatedResponse<AuditLog>> => {
    const response = await apiClient.get<any>(
      `${BASE_PATH}/audit`,
      { params: filters }
    );
    return transformPaginatedResponse<AuditLog>(response.data);
  },
};
