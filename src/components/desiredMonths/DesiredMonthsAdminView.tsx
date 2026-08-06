// ============================================
// Desired Months Admin View
// For HR/Admin to monitor submission status
// ============================================

import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Center,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import {
  useAllDesiredMonths,
  useUsersWithoutDesiredMonths,
  useClearDesiredMonths, // NEW
} from "@/hooks/useDesiredLeaveMonths";
import { formatDate } from "@/utils/date.utils";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const DesiredMonthsAdminView: React.FC = () => {
  const {
    data: allSubmissions,
    isLoading: loadingSubmissions,
    refetch,
  } = useAllDesiredMonths();
  const { data: usersWithout, isLoading: loadingUsers } =
    useUsersWithoutDesiredMonths();
  const clearMutation = useClearDesiredMonths();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const toast = useToast();

  const submittedCount = allSubmissions?.length || 0;
  const pendingCount = usersWithout?.length || 0;
  const totalUsers = submittedCount + pendingCount;

  // Handle clear button click
  const handleClearClick = (userId: string, userName: string) => {
    setSelectedUser({ id: userId, name: userName });
    onOpen();
  };

  // Handle confirm clear
  const handleConfirmClear = async () => {
    if (!selectedUser) return;

    try {
      await clearMutation.mutateAsync(selectedUser.id);
      // Refetch data after successful clear
      await refetch();
      onClose();
      setSelectedUser(null);
    } catch (error) {
      // Error is handled by the mutation
      console.error("Clear error:", error);
    }
  };

  if (loadingSubmissions || loadingUsers) {
    return (
      <Center py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Loading desired months data...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box>
        <Heading size="lg" mb={2}>
          Desired Leave Months Management
        </Heading>
        <Text color="gray.600">
          Monitor staff submissions of desired annual leave months
        </Text>
      </Box>

      {/* Statistics */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>{totalUsers}</StatNumber>
              <StatHelpText>Active staff members</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card borderColor="green.200" borderWidth="2px">
          <CardBody>
            <Stat>
              <HStack>
                <Icon as={FiCheckCircle} color="green.500" boxSize={5} />
                <StatLabel>Submitted</StatLabel>
              </HStack>
              <StatNumber color="green.600">{submittedCount}</StatNumber>
              <StatHelpText>
                {totalUsers > 0
                  ? `${Math.round((submittedCount / totalUsers) * 100)}% complete`
                  : "No users"}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card borderColor="orange.200" borderWidth="2px">
          <CardBody>
            <Stat>
              <HStack>
                <Icon as={FiAlertCircle} color="orange.500" boxSize={5} />
                <StatLabel>Pending</StatLabel>
              </HStack>
              <StatNumber color="orange.600">{pendingCount}</StatNumber>
              <StatHelpText>Awaiting submission</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Pending Users */}
      {pendingCount > 0 && (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <AlertDescription>
            <strong>{pendingCount}</strong> user
            {pendingCount !== 1 ? "s have" : " has"} not submitted desired leave
            months yet. They will be prompted on login.
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Users Table */}
      {pendingCount > 0 && (
        <Card>
          <CardHeader borderBottomWidth="1px">
            <Heading size="md">
              <HStack>
                <Icon as={FiAlertCircle} color="orange.500" />
                <Text>Pending Submissions</Text>
              </HStack>
            </Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Department</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {usersWithout?.map((user) => (
                  <Tr key={user.id}>
                    <Td fontWeight="medium">{user.full_name}</Td>
                    <Td fontSize="sm" color="gray.600">
                      {user.email}
                    </Td>
                    <Td fontSize="sm">
                      {(user.department as any)?.name || "N/A"}
                    </Td>
                    <Td>
                      <Badge colorScheme="orange" variant="subtle">
                        Not Submitted
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      )}

      {/* Submitted Months Table - WITH CLEAR BUTTON */}
      <Card>
        <CardHeader borderBottomWidth="1px">
          <HStack justify="space-between">
            <Heading size="md">
              <HStack>
                <Icon as={FiCheckCircle} color="green.500" />
                <Text>Submitted Desired Months</Text>
              </HStack>
            </Heading>
            <Badge colorScheme="blue" fontSize="sm">
              {submittedCount} submitted
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          {submittedCount === 0 ? (
            <Center py={10}>
              <VStack spacing={2}>
                <Icon as={FiCalendar} boxSize={8} color="gray.300" />
                <Text color="gray.500">No submissions yet</Text>
              </VStack>
            </Center>
          ) : (
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Desired Months</Th>
                  <Th>Submitted</Th>
                  <Th textAlign="center">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allSubmissions?.map((submission) => {
                  const userName = (submission.user as any)?.full_name || "N/A";
                  const userId = submission.user_id;

                  return (
                    <Tr key={submission.id}>
                      <Td fontWeight="medium">{userName}</Td>
                      <Td fontSize="sm" color="gray.600">
                        {(submission.user as any)?.email || "N/A"}
                      </Td>
                      <Td>
                        <HStack spacing={1} flexWrap="wrap">
                          {submission.preferred_months.map((monthNum) => (
                            <Badge
                              key={monthNum}
                              colorScheme="blue"
                              variant="subtle"
                              fontSize="xs"
                              px={2}
                            >
                              {MONTH_NAMES[monthNum - 1]}
                            </Badge>
                          ))}
                        </HStack>
                      </Td>
                      <Td fontSize="sm" color="gray.600">
                        {formatDate(submission.submitted_at)}
                      </Td>
                      <Td>
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          leftIcon={<FiTrash2 />}
                          onClick={() => handleClearClick(userId, userName)}
                          isLoading={
                            clearMutation.isPending &&
                            clearMutation.variables === userId
                          }
                          isDisabled={clearMutation.isPending}
                        >
                          Clear
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Clear Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Clear Desired Months</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text>
                  This action will permanently delete the desired leave months
                  for:
                </Text>
              </Alert>
              <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
                <Text fontSize="lg" fontWeight="bold">
                  {selectedUser?.name}
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.600">
                After clearing, the staff member will need to resubmit their
                desired leave months before they can apply for annual leave.
              </Text>
              <Alert status="error" borderRadius="md" size="sm">
                <AlertIcon />
                <Text fontSize="sm">This action cannot be undone!</Text>
              </Alert>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              leftIcon={<FiTrash2 />}
              onClick={handleConfirmClear}
              isLoading={clearMutation.isPending}
              loadingText="Clearing..."
            >
              Yes, Clear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
