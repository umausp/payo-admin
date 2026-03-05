// ============================================================================
// Dashboard Page - System Overview
// ============================================================================

import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People,
  Store,
  Payment,
  TrendingUp,
  CheckCircle,
  PendingActions,
} from '@mui/icons-material';
import { adminApi } from '@/api/admin.api';
import { QUERY_KEYS } from '@/utils/constants';
import { formatCurrency, formatNumber, formatRelativeTime } from '@/utils/format';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function MetricCard({ title, value, icon, color, subtitle }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.dark`,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_METRICS],
    queryFn: async () => {
      try {
        return await adminApi.getDashboardMetrics();
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
        throw error;
      }
    },
    retry: 2,
    refetchInterval: 30000,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_ACTIVITY],
    queryFn: async () => {
      try {
        return await adminApi.getDashboardActivity();
      } catch (error) {
        console.error('Failed to load activity:', error);
        return []; // Return empty array on error
      }
    },
    retry: 1,
    refetchInterval: 30000,
  });

  const { data: paymentStats, isLoading: statsLoading } = useQuery({
    queryKey: [QUERY_KEYS.PAYMENT_STATS],
    queryFn: async () => {
      try {
        return await adminApi.getPaymentStatistics();
      } catch (error) {
        console.error('Failed to load payment stats:', error);
        return null;
      }
    },
    retry: 1,
    refetchInterval: 30000,
  });

  if (metricsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (metricsError) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load dashboard data. Please ensure the backend services are running.
        </Alert>
        <Alert severity="info">
          <Typography variant="body2" fontWeight="600" gutterBottom>
            Quick Check:
          </Typography>
          <Typography variant="body2" component="div">
            • API Gateway running on port 3000?
            <br />
            • Admin Service running on port 3010?
            <br />
            • Check console for detailed error messages
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Here's what's happening with your platform today.
      </Typography>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Users"
            value={formatNumber(metrics?.totalUsers || 0)}
            icon={<People fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Merchants"
            value={formatNumber(metrics?.totalMerchants || 0)}
            icon={<Store fontSize="large" />}
            color="secondary"
            subtitle={`${metrics?.activeMerchants || 0} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Transactions"
            value={formatNumber(metrics?.totalTransactions || 0)}
            icon={<Payment fontSize="large" />}
            color="success"
            subtitle={`${metrics?.transactionsToday || 0} today`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Volume"
            value={formatCurrency(metrics?.totalVolume || '0')}
            icon={<TrendingUp fontSize="large" />}
            color="info"
            subtitle={formatCurrency(metrics?.volumeToday || '0') + ' today'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Payment Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Payment Statistics
              </Typography>
              {statsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : paymentStats ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="success.main">
                      {(paymentStats.successRate ?? 0).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Average Amount
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {formatCurrency(paymentStats.averageAmount || '0')}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Status Distribution
                    </Typography>
                    {(paymentStats.byStatus || []).map((item) => (
                      <Box
                        key={item.status}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1,
                        }}
                      >
                        <Chip
                          label={item.status}
                          size="small"
                          color={
                            item.status === 'confirmed'
                              ? 'success'
                              : item.status === 'failed'
                              ? 'error'
                              : 'warning'
                          }
                        />
                        <Typography variant="body2">
                          {item.count || 0} ({(item.percentage ?? 0).toFixed(1)}%)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Recent Admin Activity
              </Typography>
              {activityLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : activity && activity.length > 0 ? (
                <Box>
                  {activity.slice(0, 5).map((log) => (
                    <Box
                      key={log.id}
                      sx={{
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'primary.light',
                            fontSize: '0.875rem',
                          }}
                        >
                          {log.adminEmail.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight="600">
                            {log.adminEmail}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {log.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(log.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                System Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <PendingActions sx={{ fontSize: 40, color: 'warning.dark', mb: 1 }} />
                    <Typography variant="h5" fontWeight="700">
                      {metrics?.pendingKyc || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending KYC Reviews
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                    <CheckCircle sx={{ fontSize: 40, color: 'success.dark', mb: 1 }} />
                    <Typography variant="h5" fontWeight="700">
                      {metrics?.activeMerchants || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Merchants
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                    <Payment sx={{ fontSize: 40, color: 'info.dark', mb: 1 }} />
                    <Typography variant="h5" fontWeight="700">
                      {metrics?.transactionsToday || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transactions Today
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light' }}>
                    <TrendingUp sx={{ fontSize: 40, color: 'secondary.dark', mb: 1 }} />
                    <Typography variant="h5" fontWeight="700">
                      {formatCurrency(metrics?.volumeToday || '0')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Volume Today
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
