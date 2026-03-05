// ============================================================================
// Merchants Management Page
// ============================================================================

import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  CheckCircle,
  Cancel,
  PowerSettingsNew,
} from '@mui/icons-material';
import { adminApi } from '@/api/admin.api';
import { QUERY_KEYS, PAGINATION_DEFAULTS, KYC_STATUS_COLORS } from '@/utils/constants';
import { formatAddress, formatDate } from '@/utils/format';
import type { Merchant } from '@/types';

export function MerchantsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGINATION_DEFAULTS.LIMIT);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [kycAction, setKycAction] = useState<'approve' | 'reject'>('approve');
  const [rejectReason, setRejectReason] = useState('');

  const filters = {
    page: page + 1,
    limit: rowsPerPage,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.MERCHANTS, page + 1, rowsPerPage, search, statusFilter],
    queryFn: async () => {
      try {
        return await adminApi.getMerchants(filters);
      } catch (error) {
        console.error('Failed to load merchants:', error);
        throw error;
      }
    },
    retry: 2,
  });

  const getMerchantId = (merchant: Merchant | null) => merchant?._id || merchant?.id || '';

  const approveKycMutation = useMutation({
    mutationFn: (merchantId: string) => adminApi.approveKyc(merchantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MERCHANTS] });
      setKycDialogOpen(false);
      setSelectedMerchant(null);
    },
  });

  const rejectKycMutation = useMutation({
    mutationFn: ({ merchantId, reason }: { merchantId: string; reason: string }) =>
      adminApi.rejectKyc(merchantId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MERCHANTS] });
      setKycDialogOpen(false);
      setSelectedMerchant(null);
      setRejectReason('');
    },
  });

  const activateMerchantMutation = useMutation({
    mutationFn: (merchantId: string) => adminApi.activateMerchant(merchantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MERCHANTS] });
      setSelectedMerchant(null);
    },
  });

  const deactivateMerchantMutation = useMutation({
    mutationFn: (merchantId: string) => adminApi.deactivateMerchant(merchantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MERCHANTS] });
      setSelectedMerchant(null);
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, merchant: Merchant) => {
    setAnchorEl(event.currentTarget);
    setSelectedMerchant(merchant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewMerchant = () => {
    if (selectedMerchant) {
      const merchantId = getMerchantId(selectedMerchant);
      navigate({
        to: '/merchants/$merchantId' as any,
        params: { merchantId },
      });
    }
    handleMenuClose();
  };

  const handleApproveKyc = () => {
    setKycAction('approve');
    setKycDialogOpen(true);
    handleMenuClose();
  };

  const handleRejectKyc = () => {
    setKycAction('reject');
    setKycDialogOpen(true);
    handleMenuClose();
  };

  const handleToggleActive = () => {
    if (selectedMerchant) {
      const merchantId = getMerchantId(selectedMerchant);
      if (selectedMerchant.isActive) {
        deactivateMerchantMutation.mutate(merchantId);
      } else {
        activateMerchantMutation.mutate(merchantId);
      }
    }
    handleMenuClose();
  };

  const handleKycDialogConfirm = () => {
    if (!selectedMerchant) return;

    const merchantId = getMerchantId(selectedMerchant);
    if (kycAction === 'approve') {
      approveKycMutation.mutate(merchantId);
    } else {
      if (!rejectReason.trim()) {
        alert('Please provide a rejection reason');
        return;
      }
      rejectKycMutation.mutate({
        merchantId,
        reason: rejectReason,
      });
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) {
    return (
      <Alert severity="error">
        Failed to load merchants. Please check if the backend services are running.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Merchants Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage merchant accounts and KYC verification
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search merchants by name, email, or wallet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Tabs
            value={statusFilter}
            onChange={(_, value) => setStatusFilter(value)}
            sx={{ mb: 2 }}
          >
            <Tab label="All" value="all" />
            <Tab label="Pending KYC" value="pending" />
            <Tab label="Approved" value="approved" />
            <Tab label="Rejected" value="rejected" />
          </Tabs>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Business Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Wallet</TableCell>
                      <TableCell>KYC Status</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Registered</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data?.data || []).map((merchant) => {
                      const merchantId = merchant._id || merchant.id || '';
                      const kycColor = KYC_STATUS_COLORS[merchant.kycStatus as keyof typeof KYC_STATUS_COLORS] || 'default';

                      return (
                        <TableRow key={merchantId} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {merchant.businessName}
                            </Typography>
                          </TableCell>
                          <TableCell>{merchant.email}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {formatAddress(merchant.walletAddress)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={merchant.kycStatus}
                              color={kycColor}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={merchant.isActive ? 'Active' : 'Inactive'}
                              color={merchant.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(merchant.createdAt)}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, merchant)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={data?.pagination.total || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewMerchant}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedMerchant?.kycStatus === 'pending' && (
          <>
            <MenuItem onClick={handleApproveKyc}>
              <CheckCircle fontSize="small" sx={{ mr: 1 }} />
              Approve KYC
            </MenuItem>
            <MenuItem onClick={handleRejectKyc}>
              <Cancel fontSize="small" sx={{ mr: 1 }} />
              Reject KYC
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleToggleActive}>
          <PowerSettingsNew fontSize="small" sx={{ mr: 1 }} />
          {selectedMerchant?.isActive ? 'Deactivate' : 'Activate'}
        </MenuItem>
      </Menu>

      {/* KYC Action Dialog */}
      <Dialog open={kycDialogOpen} onClose={() => setKycDialogOpen(false)}>
        <DialogTitle>
          {kycAction === 'approve' ? 'Approve KYC' : 'Reject KYC'}
        </DialogTitle>
        <DialogContent>
          {kycAction === 'approve' ? (
            <DialogContentText>
              Are you sure you want to approve this merchant's KYC? They will gain full
              access to the platform.
            </DialogContentText>
          ) : (
            <Box>
              <DialogContentText sx={{ mb: 2 }}>
                Please provide a reason for rejecting this merchant's KYC application:
              </DialogContentText>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setKycDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleKycDialogConfirm}
            color={kycAction === 'approve' ? 'success' : 'error'}
            variant="contained"
            disabled={approveKycMutation.isPending || rejectKycMutation.isPending}
          >
            {approveKycMutation.isPending || rejectKycMutation.isPending
              ? 'Processing...'
              : kycAction === 'approve'
              ? 'Approve'
              : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
