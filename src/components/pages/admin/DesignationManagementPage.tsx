// ============================================
// DesignationManagementPage - Designation Admin
// Manage job titles and positions
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { DesignationManagement } from '@/components/admin/DesignationManagement';

const DesignationManagementPage: React.FC = () => {
  return (
    <Box>
      <DesignationManagement />
    </Box>
  );
};

export default DesignationManagementPage;
