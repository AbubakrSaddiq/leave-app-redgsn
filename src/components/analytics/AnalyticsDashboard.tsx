// src/components/analytics/AnalyticsDashboard.tsx
import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Icon,
  Divider,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiUserCheck,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiPieChart,
  FiClock,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useDirectorAnalytics, useHRAnalytics } from "@/hooks/useAnalytics";
import { DepartmentStats } from "./DepartmentStats";
import { LeaveStatusChart } from "./LeaveStatusChart";
import { ActiveLeaveTable } from "./ActiveLeaveTable";
import { UpcomingLeaveTable } from "./UpcomingLeaveTable";

export const AnalyticsDashboard: React.FC = () => {
  const { profile } = useAuth();
  const isDirector = profile?.role === "director";
  const isHR = profile?.role === "hr" || profile?.role === "admin";

  const directorQuery = useDirectorAnalytics();
  const hrQuery = useHRAnalytics();

  // Determine which query to use
  const { data, isLoading, error } = isDirector ? directorQuery : hrQuery;

  if (isLoading) {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Loading analytics data...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Text>{(error as Error).message}</Text>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert status="warning" borderRadius="md">
        <AlertIcon />
        <Text>No analytics data available</Text>
      </Alert>
    );
  }

  const stats = [
    {
      label: "Total Staff",
      value: data.total_staff,
      icon: FiUsers,
      color: "blue",
    },
    {
      label: "Currently On Leave",
      value: data.total_on_leave,
      icon: FiUserCheck,
      color: "green",
    },
    {
      label: "Upcoming Leave",
      value: data.total_upcoming_leaves,
      icon: FiCalendar,
      color: "orange",
    },
    {
      label: "Completed Leaves",
      value: data.total_completed_leaves,
      icon: FiCheckCircle,
      color: "purple",
    },
  ];

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box>
        <HStack justify="space-between" wrap="wrap" gap={3}>
          <Box>
            <Heading size="lg" mb={1}>
              Analytics Dashboard
            </Heading>
            <Text color="gray.600">
              {isDirector
                ? "View analytics for your department"
                : "View organization-wide analytics"}
            </Text>
          </Box>
          <Badge
            colorScheme={isDirector ? "blue" : "purple"}
            fontSize="md"
            p={2}
          >
            {isDirector ? "Director View" : "HR/Admin View"}
          </Badge>
        </HStack>
        <Divider mt={4} />
      </Box>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {stats.map((stat, index) => (
          <Card
            key={index}
            borderLeft={`4px solid`}
            borderLeftColor={`${stat.color}.500`}
          >
            <CardBody>
              <Stat>
                <StatLabel>
                  <HStack spacing={2}>
                    <Icon as={stat.icon} color={`${stat.color}.500`} />
                    <Text>{stat.label}</Text>
                  </HStack>
                </StatLabel>
                <StatNumber color={`${stat.color}.600`}>
                  {stat.value}
                </StatNumber>
                <StatHelpText>
                  {stat.label === "Total Staff" &&
                    `${data.total_on_leave} currently on leave`}
                  {stat.label === "Currently On Leave" &&
                    `${data.total_staff > 0 ? ((data.total_on_leave / data.total_staff) * 100).toFixed(1) : 0}% of staff`}
                  {stat.label === "Upcoming Leave" &&
                    `${data.total_on_leave + data.total_upcoming_leaves} total leave requests`}
                  {stat.label === "Completed Leaves" &&
                    `${data.total_completed_leaves} leaves processed`}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Charts and Tables */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Department Stats */}
        <DepartmentStats stats={data.department_stats} />

        {/* Leave Type Distribution */}
        <LeaveStatusChart
          leaveTypeDistribution={data.leave_type_distribution}
        />
      </SimpleGrid>

      {/* Active Leave Table */}
      <ActiveLeaveTable leaves={data.active_leaves} />

      {/* Upcoming Leave Table */}
      <UpcomingLeaveTable leaves={data.upcoming_leaves} />
    </VStack>
  );
};
