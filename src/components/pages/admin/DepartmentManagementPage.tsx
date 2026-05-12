// ============================================
// DepartmentManagementPage - Department Admin
// Manage organizational departments
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { DepartmentManagement } from '@/components/admin/DepartmentManagement';

const DepartmentManagementPage: React.FC = () => {
  return (
    <Box>
      <DepartmentManagement />
    </Box>
  );
};

export default DepartmentManagementPage;
