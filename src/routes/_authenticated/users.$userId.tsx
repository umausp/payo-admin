// ============================================================================
// User Detail Route
// ============================================================================

import { createFileRoute } from '@tanstack/react-router';
import { UserDetailPage } from '@/features/users/UserDetailPage';

export const Route = createFileRoute('/_authenticated/users/$userId')({
  component: UserDetailPage,
});
