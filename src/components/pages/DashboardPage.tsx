// ============================================
// DashboardPage - Dashboard Home Page
// Wraps BalanceDashboard with enterprise layout
// ============================================

import React from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { BalanceDashboard } from "@/components/balances/BalanceDashboard";
import { DesiredMonthsChecker } from "@/components/desiredMonths/DesiredMonthsChecker";

const DashboardPage: React.FC = () => {
  return (
    <VStack spacing={8} align="stretch">
      {/* Desired Months Modal Checker */}
      <DesiredMonthsChecker />

      {/* Main Dashboard Content */}
      <Box>
        <BalanceDashboard />
      </Box>
    </VStack>
  );
};

export default DashboardPage;
