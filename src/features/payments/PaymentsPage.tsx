// ============================================================================
// Payments Page - Placeholder
// ============================================================================

import { Box, Typography, Card, CardContent } from '@mui/material';
import { Payment } from '@mui/icons-material';

export function PaymentsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Payments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Monitor all payment transactions
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Payment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Payment monitoring page coming soon
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
