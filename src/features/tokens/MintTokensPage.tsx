// ============================================================================
// Mint PAYO Tokens Page
// ============================================================================

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Send,
  CheckCircle,
  Error,
  HourglassEmpty,
} from '@mui/icons-material';
import { adminApi } from '@/api/admin.api';
import { QUERY_KEYS, PAGINATION_DEFAULTS } from '@/utils/constants';
import { formatDate } from '@/utils/format';

export function MintTokensPage() {
  const queryClient = useQueryClient();

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(PAGINATION_DEFAULTS.LIMIT);

  // Fetch token stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [QUERY_KEYS.TOKEN_STATS],
    queryFn: adminApi.getTokenStats,
  });

  // Fetch mint history
  const { data: mintHistory, isLoading: historyLoading } = useQuery({
    queryKey: [QUERY_KEYS.MINT_HISTORY, page + 1, rowsPerPage],
    queryFn: async () => {
      return await adminApi.getMintHistory({
        page: page + 1,
        limit: rowsPerPage,
      });
    },
  });

  // Mint tokens mutation
  const mintMutation = useMutation({
    mutationFn: (data: { address: string; amount: string; reason?: string }) =>
      adminApi.mintTokens(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOKEN_STATS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MINT_HISTORY] });
      setAddress('');
      setAmount('');
      setReason('');
    },
  });

  const handleMint = () => {
    if (!address || !amount) {
      return;
    }
    mintMutation.mutate({ address, amount, reason: reason || undefined });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle color="success" />;
      case 'failed':
        return <Error color="error" />;
      case 'pending':
        return <HourglassEmpty color="warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mint PAYO Tokens
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Mint PAYO tokens to user wallets for testing and funding
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Token Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Token Statistics
              </Typography>
              {statsLoading ? (
                <CircularProgress />
              ) : stats ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <AccountBalanceWallet sx={{ fontSize: 40, color: 'primary.main' }} />
                      <Typography variant="h4" color="primary">
                        {parseFloat(stats.totalSupply).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Supply (PAYO)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <AccountBalanceWallet sx={{ fontSize: 40, color: 'success.main' }} />
                      <Typography variant="h4" color="success.main">
                        {parseFloat(stats.remainingSupply).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Remaining Supply (PAYO)
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Token Address:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                        {stats.tokenAddress}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Minter Address:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {stats.minterAddress}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="error">Failed to load token statistics</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Mint Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mint New Tokens
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                label="Recipient Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                sx={{ mb: 2 }}
                helperText="Enter the Ethereum address to receive tokens"
              />

              <TextField
                fullWidth
                label="Amount (PAYO)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                sx={{ mb: 2 }}
                helperText="Enter amount in PAYO tokens"
              />

              <TextField
                fullWidth
                label="Reason (Optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Test user funding"
                multiline
                rows={2}
                sx={{ mb: 2 }}
                helperText="Optional note for audit trail"
              />

              <Button
                fullWidth
                variant="contained"
                startIcon={<Send />}
                onClick={handleMint}
                disabled={!address || !amount || mintMutation.isPending}
              >
                {mintMutation.isPending ? 'Minting...' : 'Mint Tokens'}
              </Button>

              {mintMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {mintMutation.error && typeof mintMutation.error === 'object' && 'message' in mintMutation.error
                    ? (mintMutation.error as Error).message
                    : 'Failed to mint tokens'}
                </Alert>
              )}

              {mintMutation.isSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Tokens minted successfully! TX Hash: {mintMutation.data?.txHash?.substring(0, 10)}...
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Mint History */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mint History
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {historyLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Recipient</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Admin</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>TX Hash</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mintHistory?.data?.map((mint: any) => (
                          <TableRow key={mint.mintId}>
                            <TableCell>{formatDate(mint.createdAt)}</TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {mint.toAddress.substring(0, 10)}...
                              </Typography>
                            </TableCell>
                            <TableCell>{mint.amount} PAYO</TableCell>
                            <TableCell>{mint.adminEmail}</TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(mint.status)}
                                label={mint.status}
                                color={getStatusColor(mint.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {mint.txHash ? (
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {mint.txHash.substring(0, 10)}...
                                </Typography>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    component="div"
                    count={mintHistory?.pagination?.total || 0}
                    page={page}
                    onPageChange={(_e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
