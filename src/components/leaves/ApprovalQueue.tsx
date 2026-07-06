// src/components/approvals/ApprovalQueue.tsx
import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Select,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { LeaveApplicationCard } from "@/components/leaves/LeaveApplicationCard";
import { LeaveStatus } from "@/types/models";
import { useApprovalQueue } from "@/hooks/useApprovalQueue";

interface ApprovalQueueProps {
  role: "director" | "hr";
}

export const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ role }) => {
  const {
    applications,
    regularPendingCount,
    resumptionPendingCount,
    totalPendingCount,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    handleApprove,
    handleReject,
    isProcessing,
  } = useApprovalQueue(role);

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Text>{error.message}</Text>
      </Alert>
    );
  }

  const roleLabel = role === "director" ? "Director" : "HR";

  return (
    <Box>
      {/* Header with stats */}
      <VStack align="stretch" spacing={4} mb={6}>
        <HStack justify="space-between" wrap="wrap" gap={3}>
          <HStack spacing={3}>
            <Text fontSize="lg" fontWeight="bold">
              {roleLabel} Approval Queue
            </Text>
            <Badge colorScheme="blue" fontSize="md" p={2} borderRadius="md">
              {totalPendingCount} Pending
            </Badge>
          </HStack>

          {/* Filter - MOVED OUTSIDE Select */}
          <HStack spacing={3}>
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Filter:
            </Text>
            <Select
              size="sm"
              width="200px"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Pending</option>
              <option
                value={role === "director" ? "pending_director" : "pending_hr"}
              >
                Regular Leaves
              </option>
              <option
                value={
                  role === "director"
                    ? "pending_resumption_director"
                    : "pending_resumption_hr"
                }
              >
                Resumption Requests
              </option>
            </Select>
          </HStack>
        </HStack>

        {/* Stats summary */}
        <HStack spacing={4} wrap="wrap">
          <Badge colorScheme="orange" fontSize="sm" p={2}>
            Regular: {regularPendingCount}
          </Badge>
          <Badge colorScheme="purple" fontSize="sm" p={2}>
            Resumption: {resumptionPendingCount}
          </Badge>
        </HStack>
        <Divider />
      </VStack>

      {/* Applications Grid */}
      {applications.length === 0 ? (
        <Center py={10}>
          <VStack spacing={3}>
            <Text color="gray.500" fontSize="lg">
              No pending requests
            </Text>
            <Text color="gray.400" fontSize="sm">
              All caught up! 🎉
            </Text>
          </VStack>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {applications.map((application) => (
            <LeaveApplicationCard
              key={application.id}
              application={application}
              onApprove={handleApprove}
              onReject={handleReject}
              showActions={true}
              currentUserRole={role}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
