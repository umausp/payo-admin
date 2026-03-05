// ============================================================================
// Payments Route
// ============================================================================

import { createFileRoute } from '@tanstack/react-router';
import { PaymentsPage } from '@/features/payments/PaymentsPage';

export const Route = createFileRoute('/_authenticated/payments')({
  component: PaymentsPage,
});
