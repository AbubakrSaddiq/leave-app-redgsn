// ============================================
// UserManagementPage - User Management Admin
// Manage staff members and their access
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { UserManagement } from '@/components/admin/UserManagement';

const UserManagementPage: React.FC = () => {
  return (
    <Box>
      <UserManagement />
    </Box>
  );
};

export default UserManagementPage;
