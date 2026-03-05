// ============================================================================
// Application Constants
// ============================================================================

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001';
export const ADMIN_SERVICE_URL = import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:3010';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Payo Admin';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const TOKEN_STORAGE_KEY = 'payo_admin_tokens';
export const ADMIN_STORAGE_KEY = 'payo_admin_data';

export const QUERY_KEYS = {
  DASHBOARD_METRICS: 'dashboard-metrics',
  DASHBOARD_ACTIVITY: 'dashboard-activity',
  PAYMENT_STATS: 'payment-stats',
  USERS: 'users',
  USER_DETAIL: 'user-detail',
  USER_TRANSACTIONS: 'user-transactions',
  MERCHANTS: 'merchants',
  MERCHANT_DETAIL: 'merchant-detail',
  MERCHANT_STATS: 'merchant-stats',
  PAYMENTS: 'payments',
  PAYMENT_DETAIL: 'payment-detail',
  ADMINS: 'admins',
  ADMIN_DETAIL: 'admin-detail',
  ADMIN_ACTIVITY: 'admin-activity',
  AUDIT_LOGS: 'audit-logs',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/users',
  USER_DETAIL: '/users/$userId',
  MERCHANTS: '/merchants',
  MERCHANT_DETAIL: '/merchants/$merchantId',
  PAYMENTS: '/payments',
  PAYMENT_DETAIL: '/payments/$paymentId',
  ADMINS: '/admins',
  ADMIN_DETAIL: '/admins/$adminId',
  AUDIT_LOGS: '/audit-logs',
  PROFILE: '/profile',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
} as const;

export const KYC_STATUS_COLORS = {
  pending: 'warning',
  submitted: 'info',
  approved: 'success',
  rejected: 'error',
} as const;

export const PAYMENT_STATUS_COLORS = {
  pending: 'info',
  submitted: 'warning',
  confirmed: 'success',
  failed: 'error',
} as const;

export const ROLE_LABELS = {
  admin: 'Admin',
  super_admin: 'Super Admin',
} as const;
