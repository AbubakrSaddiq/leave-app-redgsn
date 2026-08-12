// src/components/analytics/UpcomingLeaveTable.tsx
import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  VStack,
  HStack,
  Icon,
  Tag,
} from "@chakra-ui/react";
import { FiCalendar, FiClock, FiTrendingUp } from "react-icons/fi";
import { UpcomingLeave } from "@/api/analytics.api";
import { formatDisplayDate } from "@/utils/dateUtils";

interface UpcomingLeaveTableProps {
  leaves: UpcomingLeave[];
  title?: string;
}

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

const getDaysColor = (days: number): string => {
  if (days <= 7) return "red";
  if (days <= 14) return "orange";
  if (days <= 30) return "yellow";
  return "green";
};

export const UpcomingLeaveTable: React.FC<UpcomingLeaveTableProps> = ({
  leaves,
  title = "Upcoming Leave",
}) => {
  if (leaves.length === 0) {
    return (
      <Card>
        <CardHeader borderBottomWidth="1px">
          <Heading size="md">
            <HStack>
              <Icon as={FiTrendingUp} color="blue.500" />
              <Text>{title}</Text>
            </HStack>
          </Heading>
        </CardHeader>
        <CardBody>
          <Box textAlign="center" py={8}>
            <Icon as={FiCalendar} boxSize={8} color="gray.300" />
            <Text color="gray.500" mt={2}>
              No upcoming leave scheduled
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader borderBottomWidth="1px">
        <HStack justify="space-between">
          <Heading size="md">
            <HStack>
              <Icon as={FiTrendingUp} color="blue.500" />
              <Text>{title}</Text>
            </HStack>
          </Heading>
          <Badge colorScheme="blue" fontSize="sm">
            {leaves.length} Upcoming
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>Staff</Th>
              <Th>Department</Th>
              <Th>Leave Type</Th>
              <Th>Start Date</Th>
              <Th>Duration</Th>
              <Th>Days Until</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leaves.map((leave) => (
              <Tr key={leave.id}>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium" fontSize="sm">
                      {leave.user_name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {leave.user_email}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Badge colorScheme="gray" variant="subtle">
                    {leave.department_name}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={getLeaveTypeColor(leave.leave_type)}>
                    {leave.leave_type}
                  </Badge>
                </Td>
                <Td>
                  <Text fontWeight="medium" fontSize="sm">
                    {formatDisplayDate(leave.start_date)}
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="sm">
                    {leave.working_days}{" "}
                    {leave.working_days === 1 ? "day" : "days"}
                  </Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme={getDaysColor(leave.days_until_start)}
                    fontSize="sm"
                    px={3}
                    py={1}
                  >
                    {leave.days_until_start}{" "}
                    {leave.days_until_start === 1 ? "day" : "days"}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};
