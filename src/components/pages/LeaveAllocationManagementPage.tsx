// ============================================
// LeaveAllocationManagementPage - Leave Allocation Admin
// Manage and allocate leave for staff
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { LeaveAllocationManagement } from '@/components/admin/LeaveAllocationManagement';

const LeaveAllocationManagementPage: React.FC = () => {
  return (
    <Box>
      <LeaveAllocationManagement />
    </Box>
  );
};

export default LeaveAllocationManagementPage;
