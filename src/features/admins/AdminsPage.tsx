// ============================================================================
// Admins Page - Placeholder (Super Admin only)
// ============================================================================

import { Box, Typography, Card, CardContent } from '@mui/material';
import { SupervisorAccount } from '@mui/icons-material';

export function AdminsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Admin Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage admin accounts (Super Admin only)
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SupervisorAccount sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Admin management page coming soon
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
