// ============================================
// ApprovalsPage - Leave Approvals Management
// Wraps ApprovalQueue component
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import { ApprovalQueue } from '@/components/leaves/ApprovalQueue';

const ApprovalsPage: React.FC = () => {
  const { profile } = useAuth();

  // Determine role for approval queue
  const role = profile?.role === 'director' ? 'director' : 'hr';

  return (
    <Box>
      <ApprovalQueue role={role} />
    </Box>
  );
};

export default ApprovalsPage;
