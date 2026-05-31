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
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useMyLeaveBalances } from "@/hooks/useLeaveBalance";
import { BalanceCard } from "./BalanceCard";

export const BalanceDashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data, isLoading, error } = useMyLeaveBalances(selectedYear);

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

  // Responsive values
  const headingSize = useBreakpointValue({ base: "md", sm: "lg" });
  const statLayout = useBreakpointValue({ base: "vertical", md: "horizontal" });
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (isLoading) {
    return (
      <Box textAlign="center" py={{ base: 8, md: 10 }}>
        <Spinner
          size={{ base: "lg", md: "xl" }}
          color="blue.500"
          thickness="4px"
        />
        <Text mt={4} fontSize={{ base: "sm", md: "md" }} color="gray.600">
          Loading leave balances...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        status="error"
        borderRadius="md"
        flexDirection={{ base: "column", sm: "row" }}
      >
        <AlertIcon />
        <AlertDescription fontSize={{ base: "sm", md: "md" }}>
          Failed to load leave balances. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.balances.length === 0) {
    return (
      <Alert
        status="info"
        borderRadius="md"
        flexDirection={{ base: "column", sm: "row" }}
      >
        <AlertIcon />
        <AlertDescription fontSize={{ base: "sm", md: "md" }}>
          No leave balances found for {selectedYear}. Contact HR to allocate
          your leave.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      {/* Header Section - Responsive layout */}
      <Stack
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        spacing={{ base: 3, md: 4 }}
      >
        <Box>
          <Heading
            size={headingSize}
            mb={{ base: 1, md: 2 }}
            fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
          >
            Leave Balance Overview
          </Heading>
          <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.600">
            View your available leave days across all types
          </Text>
        </Box>

        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          width={{ base: "100%", sm: "150px" }}
          size={{ base: "md", md: "lg" }}
          maxW={{ base: "100%", sm: "200px" }}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Stack>

      {/* Summary Statistics - Responsive layout */}
      <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="lg" boxShadow="md">
        {statLayout === "horizontal" ? (
          // Desktop: 3 columns horizontal
          <StatGroup>
            <Stat>
              <StatLabel fontSize={{ base: "sm", md: "md" }}>
                Total Allocated
              </StatLabel>
              <StatNumber
                fontSize={{ base: "2xl", md: "3xl" }}
                color="blue.600"
              >
                {data.summary.total_allocated} days
              </StatNumber>
              <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                Across all leave types
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize={{ base: "sm", md: "md" }}>
                Total Used
              </StatLabel>
              <StatNumber
                fontSize={{ base: "2xl", md: "3xl" }}
                color="orange.600"
              >
                {data.summary.total_used} days
              </StatNumber>
              <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                {data.summary.total_allocated > 0
                  ? `${((data.summary.total_used / data.summary.total_allocated) * 100).toFixed(1)}% utilized`
                  : "N/A"}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize={{ base: "sm", md: "md" }}>
                Total Available
              </StatLabel>
              <StatNumber
                fontSize={{ base: "2xl", md: "3xl" }}
                color="green.600"
              >
                {data.summary.total_available} days
              </StatNumber>
              <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                Ready to use
              </StatHelpText>
            </Stat>
          </StatGroup>
        ) : (
          // Mobile: Vertical stack
          <VStack
            spacing={4}
            align="stretch"
            divider={<Box h="1px" bg="gray.100" />}
          >
            <Stat>
              <StatLabel fontSize="sm">Total Allocated</StatLabel>
              <StatNumber fontSize="2xl" color="blue.600">
                {data.summary.total_allocated} days
              </StatNumber>
              <StatHelpText fontSize="xs">Across all leave types</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="sm">Total Used</StatLabel>
              <StatNumber fontSize="2xl" color="orange.600">
                {data.summary.total_used} days
              </StatNumber>
              <StatHelpText fontSize="xs">
                {data.summary.total_allocated > 0
                  ? `${((data.summary.total_used / data.summary.total_allocated) * 100).toFixed(1)}% utilized`
                  : "N/A"}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="sm">Total Available</StatLabel>
              <StatNumber fontSize="2xl" color="green.600">
                {data.summary.total_available} days
              </StatNumber>
              <StatHelpText fontSize="xs">Ready to use</StatHelpText>
            </Stat>
          </VStack>
        )}
      </Box>

      {/* Low Balance Warning Alert - Mobile friendly */}
      {data.balances.some(
        (b) => b.available_days > 0 && b.available_days <= 5,
      ) && (
        <Alert
          status="warning"
          borderRadius="md"
          flexDirection={{ base: "column", sm: "row" }}
          alignItems={{ base: "center", sm: "flex-start" }}
          textAlign={{ base: "center", sm: "left" }}
        >
          <AlertIcon boxSize={{ base: 4, md: 5 }} />
          <AlertDescription fontSize={{ base: "xs", sm: "sm", md: "md" }}>
            You have low balance on some leave types. Consider planning your
            leave.
          </AlertDescription>
        </Alert>
      )}

      {/* Balance Cards Grid */}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={{ base: 3, md: 4, lg: 6 }}
      >
        {data.balances.map((balance) => (
          <BalanceCard key={balance.id} balance={balance} />
        ))}
      </Grid>
    </VStack>
  );
};
