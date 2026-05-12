// ============================================
// DesiredMonthsManagementPage - Desired Months Admin
// Monitor staff submissions of desired leave months
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { DesiredMonthsAdminView } from '@/components/desiredMonths/DesiredMonthsAdminView';

const DesiredMonthsManagementPage: React.FC = () => {
  return (
    <Box>
      <DesiredMonthsAdminView />
    </Box>
  );
};

export default DesiredMonthsManagementPage;
