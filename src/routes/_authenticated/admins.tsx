// ============================================================================
// Admins Route
// ============================================================================

import { createFileRoute } from '@tanstack/react-router';
import { AdminsPage } from '@/features/admins/AdminsPage';

export const Route = createFileRoute('/_authenticated/admins')({
  component: AdminsPage,
});
