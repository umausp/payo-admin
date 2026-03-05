// ============================================================================
// Core Type Definitions for Payo Admin Dashboard
// ============================================================================

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface User {
  _id: string;
  id?: string; // Computed field
  walletAddress: string | null;
  email?: string;
  fullName?: string;
  profilePicture?: string;
  picture?: string; // Google profile picture
  isBlocked?: boolean;
  isActive?: boolean;
  createdAt: string;
  lastLoginAt?: string;
  googleId?: string;
  kycStatus?: string;
  roles?: string[];
  emailVerified?: boolean;
}

export interface Merchant {
  _id: string;
  id?: string; // Computed field
  merchantId?: string;
  userId?: string;
  businessName: string;
  businessType?: string;
  walletAddress: string;
  email: string;
  phone?: string;
  contactPerson?: string;
  website?: string;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'submitted';
  kycData?: {
    documentType?: string;
    documentNumber?: string;
    submittedAt?: string;
  };
  kycDocuments?: {
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  kycRejectionReason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  merchantId: string;
  merchantName?: string;
  userWalletAddress?: string;
  amount: string;
  currency: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  txHash?: string;
  blockNumber?: number;
  confirmations?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  confirmedAt?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'merchant' | 'admin' | 'system';
  targetId: string;
  details: Record<string, any>;
  ip: string;
  userAgent: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalMerchants: number;
  activeMerchants: number;
  pendingKyc: number;
  totalTransactions: number;
  totalVolume: string;
  transactionsToday: number;
  volumeToday: string;
}

export interface PaymentStatistics {
  totalCount: number;
  totalVolume: string;
  successRate: number;
  averageAmount: string;
  byStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  recentTrends: {
    date: string;
    count: number;
    volume: string;
  }[];
}

export interface MerchantStats {
  totalTransactions: number;
  totalVolume: string;
  successRate: number;
  averageTransactionAmount: string;
  recentActivity: {
    date: string;
    transactions: number;
    volume: string;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  admin: Admin | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

export interface QueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  startDate?: string;
  endDate?: string;
}
