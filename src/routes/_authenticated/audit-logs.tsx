// ============================================================================
// Audit Logs Route
// ============================================================================

import { createFileRoute } from '@tanstack/react-router';
import { AuditLogsPage } from '@/features/audit/AuditLogsPage';

export const Route = createFileRoute('/_authenticated/audit-logs')({
  component: AuditLogsPage,
});
