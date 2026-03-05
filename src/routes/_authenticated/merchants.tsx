// ============================================================================
// Merchants Route
// ============================================================================

import { createFileRoute } from '@tanstack/react-router';
import { MerchantsPage } from '@/features/merchants/MerchantsPage';

export const Route = createFileRoute('/_authenticated/merchants')({
  component: MerchantsPage,
});
