// ============================================================================
// Merchant Detail Page
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
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { adminApi } from '@/api/admin.api';
import { QUERY_KEYS, KYC_STATUS_COLORS } from '@/utils/constants';
import { formatAddress, formatDate } from '@/utils/format';

export function MerchantDetailPage() {
  const { merchantId } = useParams({ from: '/_authenticated/merchants/$merchantId' });
  const navigate = useNavigate();

  const { data: merchant, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.MERCHANT_DETAIL, merchantId],
    queryFn: () => adminApi.getMerchantById(merchantId),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !merchant) {
    return <Alert severity="error">Failed to load merchant details</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate({ to: '/merchants' })}
        sx={{ mb: 2 }}
      >
        Back to Merchants
      </Button>

      <Typography variant="h4" fontWeight="700" gutterBottom>
        Merchant Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">
                  {merchant.businessName}
                </Typography>
                <Box>
                  <Chip
                    label={merchant.kycStatus}
                    color={KYC_STATUS_COLORS[merchant.kycStatus as keyof typeof KYC_STATUS_COLORS] || 'default'}
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={merchant.isActive ? 'Active' : 'Inactive'}
                    color={merchant.isActive ? 'success' : 'default'}
                  />
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {merchant.contactPerson && (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Contact Person
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {merchant.contactPerson}
                      </Typography>
                    </>
                  )}

                  {merchant.phone && (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                        Phone
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {merchant.phone}
                      </Typography>
                    </>
                  )}

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {merchant.email}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    Wallet Address
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace" gutterBottom>
                    {formatAddress(merchant.walletAddress, 8)}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  {merchant.website && (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Website
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {merchant.website}
                      </Typography>
                    </>
                  )}

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    Registered
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(merchant.createdAt)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(merchant.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
