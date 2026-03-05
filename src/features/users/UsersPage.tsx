// ============================================================================
// Users Management Page
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
} from '@mui/material';
import {
  Search,
  MoreVert,
  Block,
  CheckCircle,
  Visibility,
} from '@mui/icons-material';
import { adminApi } from '@/api/admin.api';
import { QUERY_KEYS, PAGINATION_DEFAULTS } from '@/utils/constants';
import { formatAddress, formatDate } from '@/utils/format';
import type { User } from '@/types';

export function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(PAGINATION_DEFAULTS.LIMIT);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.USERS, page + 1, rowsPerPage, search],
    queryFn: async () => {
      try {
        return await adminApi.getUsers({
          page: page + 1,
          limit: rowsPerPage,
          search: search || undefined,
        });
      } catch (error) {
        console.error('Failed to load users:', error);
        throw error;
      }
    },
    retry: 2,
  });

  const blockUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.blockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      setBlockDialogOpen(false);
      setSelectedUser(null);
    },
  });

  const unblockUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      setSelectedUser(null);
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewUser = () => {
    if (selectedUser) {
      const userId = selectedUser._id || selectedUser.id || '';
      navigate({ to: '/users/$userId' as any, params: { userId } });
    }
    handleMenuClose();
  };

  const handleBlockUser = () => {
    setBlockDialogOpen(true);
    handleMenuClose();
  };

  const handleUnblockUser = () => {
    if (selectedUser) {
      const userId = selectedUser._id || selectedUser.id || '';
      unblockUserMutation.mutate(userId);
    }
    handleMenuClose();
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
        Failed to load users. Please check if the backend services are running.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Users Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View and manage all platform users
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search users by wallet address or email..."
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
                      <TableCell>Wallet Address</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Registered</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(data?.data || []).map((user) => {
                      const userId = user._id || user.id || '';
                      const isBlocked = user.isBlocked || !user.isActive;
                      const walletAddr = user.walletAddress || 'No wallet';

                      return (
                        <TableRow key={userId} hover>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {walletAddr === 'No wallet' ? walletAddr : formatAddress(walletAddr)}
                            </Typography>
                          </TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>{user.fullName || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={isBlocked ? 'Blocked' : 'Active'}
                              color={isBlocked ? 'error' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, user)}
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
        <MenuItem onClick={handleViewUser}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {(selectedUser?.isBlocked || !selectedUser?.isActive) ? (
          <MenuItem onClick={handleUnblockUser}>
            <CheckCircle fontSize="small" sx={{ mr: 1 }} />
            Unblock User
          </MenuItem>
        ) : (
          <MenuItem onClick={handleBlockUser}>
            <Block fontSize="small" sx={{ mr: 1 }} />
            Block User
          </MenuItem>
        )}
      </Menu>

      {/* Block Confirmation Dialog */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
        <DialogTitle>Block User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to block this user? They will no longer be able to
            access the platform.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedUser) {
                const userId = selectedUser._id || selectedUser.id || '';
                blockUserMutation.mutate(userId);
              }
            }}
            color="error"
            variant="contained"
            disabled={blockUserMutation.isPending}
          >
            {blockUserMutation.isPending ? 'Blocking...' : 'Block User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
