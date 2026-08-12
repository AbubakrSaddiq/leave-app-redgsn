// src/components/analytics/LeaveStatusChart.tsx
import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  Progress,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FiPieChart,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { LeaveTypeStats } from "@/api/analytics.api";
import { LEAVE_TYPE_OPTIONS } from "@/constants/leaveConstants";

interface LeaveStatusChartProps {
  leaveTypeDistribution: LeaveTypeStats[];
  title?: string;
}

const getLeaveTypeLabel = (type: string): string => {
  const option = LEAVE_TYPE_OPTIONS.find((o) => o.value === type);
  return option?.label || type;
};

const getLeaveTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    annual: "blue",
    casual: "orange",
    sick: "red",
    maternity: "pink",
    paternity: "cyan",
    study: "purple",
  };
  return colors[type] || "gray";
};

export const LeaveStatusChart: React.FC<LeaveStatusChartProps> = ({
  leaveTypeDistribution,
  title = "Leave Type Distribution",
}) => {
  const totalLeaves = leaveTypeDistribution.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <Card>
      <CardHeader borderBottomWidth="1px">
        <HStack justify="space-between">
          <Heading size="md">
            <HStack>
              <Icon as={FiPieChart} color="purple.500" />
              <Text>{title}</Text>
            </HStack>
          </Heading>
          <Badge colorScheme="purple" fontSize="sm">
            {totalLeaves} Total
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        {leaveTypeDistribution.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Icon as={FiCalendar} boxSize={8} color="gray.300" />
            <Text color="gray.500" mt={2}>
              No leave data available
            </Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {leaveTypeDistribution.map((item) => {
              const percentage =
                totalLeaves > 0 ? (item.count / totalLeaves) * 100 : 0;
              const colorScheme = getLeaveTypeColor(item.leave_type);

              return (
                <Box key={item.leave_type}>
                  <HStack justify="space-between" mb={1}>
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={colorScheme}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {getLeaveTypeLabel(item.leave_type)}
                      </Badge>
                      <Text fontSize="sm" color="gray.600">
                        {item.count} {item.count === 1 ? "leave" : "leaves"}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
                      {percentage.toFixed(1)}%
                    </Text>
                  </HStack>
                  <Progress
                    value={percentage}
                    size="md"
                    colorScheme={colorScheme}
                    borderRadius="full"
                    hasStripe
                    isAnimated
                  />
                </Box>
              );
            })}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
};
