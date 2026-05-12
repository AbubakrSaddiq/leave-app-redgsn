// ============================================
// AnalyticsPage - Leave Analytics Dashboard
// Wraps AnalyticsDashboard component
// ============================================

import React from 'react';
import { Box } from '@chakra-ui/react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <Box>
      <AnalyticsDashboard />
    </Box>
  );
};

export default AnalyticsPage;
