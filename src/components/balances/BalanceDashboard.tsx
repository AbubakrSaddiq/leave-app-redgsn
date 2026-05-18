// ============================================
// Balance Dashboard Component
// ============================================

import React, { useState } from "react";
import {
  Box,
  Grid,
  Heading,
  HStack,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
} from "@chakra-ui/react";
import { useMyLeaveBalances } from "@/hooks/useLeaveBalance";
import { BalanceCard } from "./BalanceCard";

export const BalanceDashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data, isLoading, error } = useMyLeaveBalances(selectedYear);

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} color="gray.600">
          Loading leave balances...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertDescription>
          Failed to load leave balances. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.balances.length === 0) {
    return (
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <AlertDescription>
          No leave balances found for {selectedYear}. Contact HR to allocate
          your leave.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" align="center">
        <Box>
          <Heading size="lg" mb={2}>
            Leave Balance Overview
          </Heading>
          <Text color="gray.600">
            View your available leave days across all types
          </Text>
        </Box>

        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          width="150px"
          size="lg"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </HStack>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <StatGroup>
          <Stat>
            <StatLabel>Total Allocated</StatLabel>
            <StatNumber color="blue.600">
              {data.summary.total_allocated} days
            </StatNumber>
            <StatHelpText>Across all leave types</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Total Used</StatLabel>
            <StatNumber color="orange.600">
              {data.summary.total_used} days
            </StatNumber>
            <StatHelpText>
              {data.summary.total_allocated > 0
                ? `${((data.summary.total_used / data.summary.total_allocated) * 100).toFixed(1)}% utilized`
                : "N/A"}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Total Available</StatLabel>
            <StatNumber color="green.600">
              {data.summary.total_available} days
            </StatNumber>
            <StatHelpText>Ready to use</StatHelpText>
          </Stat>
        </StatGroup>
      </Box>

      {data.balances.some(
        (b) => b.available_days > 0 && b.available_days <= 5,
      ) && (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <AlertDescription>
            You have low balance on some leave types. Consider planning your
            leave.
          </AlertDescription>
        </Alert>
      )}

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {data.balances.map((balance) => (
          <BalanceCard key={balance.id} balance={balance} />
        ))}
      </Grid>
    </VStack>
  );
};
