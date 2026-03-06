// ============================================================================
// Mint Tokens Route
// ============================================================================

import { createFileRoute } from '@tanstack/react-router';
import { MintTokensPage } from '@/features/tokens/MintTokensPage';

export const Route = createFileRoute('/_authenticated/mint-tokens')({
  component: MintTokensPage,
});
