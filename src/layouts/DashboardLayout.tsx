// ============================================================================
// Dashboard Layout with Sidebar Navigation
// ============================================================================

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Store,
  Payment,
  SupervisorAccount,
  Assessment,
  Logout,
  AccountCircle,
  AccountBalanceWallet,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';

const DRAWER_WIDTH = 260;

interface NavigationItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/', icon: <Dashboard /> },
  { label: 'Users', path: '/users', icon: <People /> },
  { label: 'Merchants', path: '/merchants', icon: <Store /> },
  { label: 'Payments', path: '/payments', icon: <Payment /> },
  { label: 'Mint Tokens', path: '/mint-tokens', icon: <AccountBalanceWallet />, roles: ['super_admin'] },
  { label: 'Admins', path: '/admins', icon: <SupervisorAccount />, roles: ['super_admin'] },
  { label: 'Audit Logs', path: '/audit-logs', icon: <Assessment /> },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate({ to: '/login' });
  };

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" color="white" fontWeight="700">
            P
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="700">
            Payo Admin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {navigationItems.map((item) => {
          // Filter by role if specified
          if (item.roles && admin && !item.roles.includes(admin.role)) {
            return null;
          }

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {admin?.fullName?.charAt(0) || 'A'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight="600" noWrap>
              {admin?.fullName || 'Admin'}
            </Typography>
            <Chip
              label={admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              size="small"
              color="primary"
              sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Dynamic title based on route */}
          </Typography>

          <IconButton onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2" fontWeight="600">
                {admin?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
