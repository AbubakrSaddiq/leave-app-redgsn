// ============================================
// MyApplicationsPage - User's Leave Applications
// Wraps MyLeaveApplications component
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { MyLeaveApplications } from '@/components/leaves/MyLeaveApplications';

const MyApplicationsPage: React.FC = () => {
  return (
    <Box>
      <MyLeaveApplications />
    </Box>
  );
};

export default MyApplicationsPage;
