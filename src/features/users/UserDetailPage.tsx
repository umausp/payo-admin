// ============================================================================
// User Detail Page
// ============================================================================

import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Avatar,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { adminApi } from '@/api/admin.api';
import { QUERY_KEYS } from '@/utils/constants';
import { formatAddress, formatDate, formatRelativeTime } from '@/utils/format';

export function UserDetailPage() {
  const { userId } = useParams({ from: '/_authenticated/users/$userId' });
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.USER_DETAIL, userId],
    queryFn: () => adminApi.getUserById(userId),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return <Alert severity="error">Failed to load user details</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate({ to: '/users' })}
        sx={{ mb: 2 }}
      >
        Back to Users
      </Button>

      <Typography variant="h4" fontWeight="700" gutterBottom>
        User Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  src={user.profilePicture || user.picture}
                >
                  {user.fullName?.charAt(0) || (user.walletAddress ? user.walletAddress.charAt(0) : 'U')}
                </Avatar>
                <Typography variant="h6" fontWeight="600">
                  {user.fullName || 'Unknown User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email || 'No email'}
                </Typography>
                <Chip
                  label={(user.isBlocked || !user.isActive) ? 'Blocked' : 'Active'}
                  color={(user.isBlocked || !user.isActive) ? 'error' : 'success'}
                  sx={{ mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Account Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body1">{user._id || user.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Wallet Address
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {user.walletAddress ? formatAddress(user.walletAddress, 8) : 'No wallet linked'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Registered
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(user.createdAt)}
                  </Typography>
                </Grid>
                {user.lastLoginAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1">
                      {formatRelativeTime(user.lastLoginAt)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
