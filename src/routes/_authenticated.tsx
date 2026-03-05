// ============================================================================
// Authenticated Routes Layout
// ============================================================================

import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useAuthStore } from '@/store/authStore';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});
