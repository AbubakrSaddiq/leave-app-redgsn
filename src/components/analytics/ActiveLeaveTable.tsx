// src/components/analytics/ActiveLeaveTable.tsx
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
import { FiUsers, FiClock, FiCalendar } from "react-icons/fi";
import { ActiveLeave } from "@/api/analytics.api";
import { formatDisplayDate } from "@/utils/dateUtils";

interface ActiveLeaveTableProps {
  leaves: ActiveLeave[];
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

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    approved: "green",
    pending_director: "orange",
    pending_hr: "purple",
  };
  return colors[status] || "gray";
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    approved: "Active",
    pending_director: "Pending Director",
    pending_hr: "Pending HR",
    pending_resumption_director: "Resumption Pending (Director)",
    pending_resumption_hr: "Resumption Pending (HR)",
  };
  return labels[status] || status;
};

export const ActiveLeaveTable: React.FC<ActiveLeaveTableProps> = ({
  leaves,
  title = "Currently On Leave",
}) => {
  if (leaves.length === 0) {
    return (
      <Card>
        <CardHeader borderBottomWidth="1px">
          <Heading size="md">
            <HStack>
              <Icon as={FiUsers} color="green.500" />
              <Text>{title}</Text>
            </HStack>
          </Heading>
        </CardHeader>
        <CardBody>
          <Box textAlign="center" py={8}>
            <Icon as={FiClock} boxSize={8} color="gray.300" />
            <Text color="gray.500" mt={2}>
              No staff currently on leave
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
              <Icon as={FiUsers} color="green.500" />
              <Text>{title}</Text>
            </HStack>
          </Heading>
          <Badge colorScheme="green" fontSize="sm">
            {leaves.length} Active
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
              <Th>Dates</Th>
              <Th>Resumption</Th>
              <Th>Status</Th>
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
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.600">
                      <Icon as={FiCalendar} boxSize={3} mr={1} />
                      Start: {formatDisplayDate(leave.start_date)}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      <Icon as={FiCalendar} boxSize={3} mr={1} />
                      End: {formatDisplayDate(leave.end_date)}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Text fontSize="sm" fontWeight="medium" color="green.600">
                    {formatDisplayDate(leave.resumption_date)}
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(leave.status)}>
                    {getStatusLabel(leave.status)}
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
