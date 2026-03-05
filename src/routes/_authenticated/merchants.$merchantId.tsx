// ============================================================================
// Merchant Detail Route
// ============================================================================

import { createFileRoute } from '@tanstack/react-router';
import { MerchantDetailPage } from '@/features/merchants/MerchantDetailPage';

export const Route = createFileRoute('/_authenticated/merchants/$merchantId')({
  component: MerchantDetailPage,
});
