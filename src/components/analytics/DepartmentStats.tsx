// src/components/analytics/DepartmentStats.tsx
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
  Progress,
  Badge,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { FiUsers, FiUserCheck, FiUserX, FiTrendingUp } from "react-icons/fi";
import { DepartmentStats as DepartmentStatsType } from "@/api/analytics.api";

interface DepartmentStatsProps {
  stats: DepartmentStatsType[];
  title?: string;
}

export const DepartmentStats: React.FC<DepartmentStatsProps> = ({
  stats,
  title = "Department Overview",
}) => {
  // Calculate totals
  const totalStaff = stats.reduce((sum, d) => sum + d.total_staff, 0);
  const totalOnLeave = stats.reduce((sum, d) => sum + d.staff_on_leave, 0);

  return (
    <Card>
      <CardHeader borderBottomWidth="1px">
        <HStack justify="space-between">
          <Heading size="md">
            <HStack>
              <Icon as={FiUsers} color="blue.500" />
              <Text>{title}</Text>
            </HStack>
          </Heading>
          <Badge colorScheme="blue" fontSize="sm">
            {stats.length} Departments
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        {/* Summary Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
          <Box p={4} bg="blue.50" borderRadius="md">
            <Stat>
              <StatLabel>Total Staff</StatLabel>
              <StatNumber>{totalStaff}</StatNumber>
              <StatHelpText>
                <HStack spacing={1}>
                  <Icon as={FiUsers} />
                  <Text>All departments</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </Box>
          <Box p={4} bg="green.50" borderRadius="md">
            <Stat>
              <StatLabel>Currently On Leave</StatLabel>
              <StatNumber color="green.600">{totalOnLeave}</StatNumber>
              <StatHelpText>
                <HStack spacing={1}>
                  <Icon as={FiUserCheck} />
                  <Text>Active leaves</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </Box>
          <Box p={4} bg="orange.50" borderRadius="md">
            <Stat>
              <StatLabel>Attendance Rate</StatLabel>
              <StatNumber color="orange.600">
                {totalStaff > 0
                  ? Math.round(((totalStaff - totalOnLeave) / totalStaff) * 100)
                  : 0}
                %
              </StatNumber>
              <StatHelpText>
                <HStack spacing={1}>
                  <Icon as={FiTrendingUp} />
                  <Text>Staff present</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Department List */}
        <VStack spacing={4} align="stretch">
          {stats.map((dept) => (
            <Box
              key={dept.department_id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ borderColor: "blue.200", bg: "gray.50" }}
              transition="all 0.2s"
            >
              <HStack justify="space-between" mb={2}>
                <HStack>
                  <Text fontWeight="bold">{dept.department_name}</Text>
                  <Badge colorScheme="gray" fontSize="xs">
                    {dept.department_code}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  {dept.staff_on_leave} / {dept.total_staff} on leave
                </Text>
              </HStack>
              <VStack spacing={1} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="xs" color="gray.500">
                    Staff on leave
                  </Text>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700">
                    {dept.staff_on_leave_percentage.toFixed(1)}%
                  </Text>
                </HStack>
                <Progress
                  value={dept.staff_on_leave_percentage}
                  size="sm"
                  colorScheme={
                    dept.staff_on_leave_percentage > 30 ? "red" : "blue"
                  }
                  borderRadius="full"
                />
              </VStack>
            </Box>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};
