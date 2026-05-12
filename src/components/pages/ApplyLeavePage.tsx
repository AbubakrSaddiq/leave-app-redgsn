// ============================================
// ApplyLeavePage - Leave Application Page
// Wraps LeaveApplicationForm
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { LeaveApplicationForm } from '@/components/leaves/LeaveApplicationForm';

const ApplyLeavePage: React.FC = () => {
  return (
    <Box>
      <LeaveApplicationForm />
    </Box>
  );
};

export default ApplyLeavePage;
