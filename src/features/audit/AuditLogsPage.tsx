// ============================================================================
// Audit Logs Page - Placeholder
// ============================================================================

import { Box, Typography, Card, CardContent } from '@mui/material';
import { Assessment } from '@mui/icons-material';

export function AuditLogsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Audit Logs
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete activity tracking and compliance
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Assessment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Audit logs page coming soon
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
