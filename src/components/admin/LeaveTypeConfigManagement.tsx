// ============================================
// Leave Type Configuration Management
// Desktop: Table layout | Mobile: Card layout
// ============================================

import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Heading,
  useDisclosure,
  useBreakpointValue,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
} from "@chakra-ui/react";
import {
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useLeaveTypeConfigs } from "@/hooks/useLeaveTypeConfig";
import { LeaveTypeConfigForm } from "./LeaveTypeConfigForm";
import {
  spacing,
  fontSizes,
  componentSizes,
  useIsMobile,
} from "@/styles/responsive";
import {
  LeaveType,
  LEAVE_TYPE_LABELS,
  LeaveTypeConfigFormData,
  LEAVE_TYPE_DESCRIPTIONS,
} from "@/types/leaveType";

// List of all possible leave types for creation
const ALL_LEAVE_TYPES: LeaveType[] = [
  "annual",
  "casual",
  "sick",
  "maternity",
  "paternity",
  "study",
];

export const LeaveTypeConfigManagement: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(
    null,
  );
  const [configToDelete, setConfigToDelete] = useState<any>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const isMobile = useIsMobile();
  const showTableView = useBreakpointValue({ base: false, md: true });
  const buttonSize = useBreakpointValue(componentSizes.buttons.md);

  const {
    configs,
    loading,
    createConfig,
    updateConfig,
    deleteConfig,
    fetchConfigs,
  } = useLeaveTypeConfigs();

  // Find which leave types are already configured
  const configuredTypes = configs.map((c) => c.leave_type);
  const unconfiguredTypes = ALL_LEAVE_TYPES.filter(
    (type) => !configuredTypes.includes(type),
  );

  const handleEdit = useCallback(
    (config: any) => {
      setSelectedLeaveType(config.leave_type);
      onOpen();
    },
    [onOpen],
  );

  const handleCreate = useCallback(
    (leaveType: LeaveType) => {
      setSelectedLeaveType(leaveType);
      onOpen();
    },
    [onOpen],
  );

  const handleDelete = useCallback(async () => {
    if (configToDelete) {
      await deleteConfig(configToDelete.leave_type);
      setConfigToDelete(null);
    }
  }, [configToDelete, deleteConfig]);

  const handleFormSubmit = useCallback(
    async (data: LeaveTypeConfigFormData) => {
      const existingConfig = configs.find(
        (c) => c.leave_type === data.leave_type,
      );
      if (existingConfig) {
        await updateConfig(data.leave_type, data);
      } else {
        await createConfig(data);
      }
      setSelectedLeaveType(null);
    },
    [configs, createConfig, updateConfig],
  );

  const getStatusBadge = (canReapply: boolean) => {
    return canReapply ? (
      <Badge
        colorScheme="green"
        variant="subtle"
        fontSize="xs"
        px={2}
        py={1}
        borderRadius="full"
      >
        <HStack spacing={1}>
          <FiCheckCircle size={10} />
          <Text>Reapply Allowed</Text>
        </HStack>
      </Badge>
    ) : (
      <Badge
        colorScheme="gray"
        variant="subtle"
        fontSize="xs"
        px={2}
        py={1}
        borderRadius="full"
      >
        Annual Only
      </Badge>
    );
  };

  if (loading) {
    return (
      <Center py={spacing.section.base}>
        <VStack spacing={spacing.stackSpacing.sm}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize={fontSizes.body.small} color="gray.500">
            Loading leave configurations...
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack align="stretch" spacing={spacing.stackSpacing.lg}>
      <Card variant="elevated" borderRadius="xl" shadow="sm">
        <CardHeader borderBottomWidth="1px" pb={spacing.gaps.md}>
          <HStack
            justify="space-between"
            wrap="wrap"
            spacing={spacing.stackSpacing.md}
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
          >
            <VStack align="start" spacing={spacing.gaps.xs}>
              <Heading
                size={isMobile ? "sm" : "md"}
                fontSize={isMobile ? "xl" : "2xl"}
              >
                Leave Type Configuration
              </Heading>
              <Text fontSize={fontSizes.body.small} color="gray.500">
                Configure annual allocations, notice periods, and reapplication
                rules for each leave type
              </Text>
            </VStack>
          </HStack>
        </CardHeader>

        <CardBody>
          {/* Summary Statistics */}
          <StatGroup
            mb={spacing.stackSpacing.lg}
            flexDirection={{ base: "column", md: "row" }}
            gap={spacing.gaps.md}
          >
            <Stat bg="blue.50" p={3} borderRadius="lg">
              <StatLabel fontSize={fontSizes.body.small}>
                Configured Types
              </StatLabel>
              <StatNumber fontSize="2xl">{configs.length}</StatNumber>
              <StatHelpText fontSize={fontSizes.body.caption}>
                Out of {ALL_LEAVE_TYPES.length}
              </StatHelpText>
            </Stat>
            <Stat bg="green.50" p={3} borderRadius="lg">
              <StatLabel fontSize={fontSizes.body.small}>
                Total Annual Allocation
              </StatLabel>
              <StatNumber fontSize="2xl">
                {configs.reduce((sum, c) => sum + (c.annual_days || 0), 0)} days
              </StatNumber>
              <StatHelpText fontSize={fontSizes.body.caption}>
                Across all leave types
              </StatHelpText>
            </Stat>
          </StatGroup>

          {/* Unconfigured Types Alert */}
          {unconfiguredTypes.length > 0 && (
            <Box
              bg="yellow.50"
              p={spacing.card}
              borderRadius="lg"
              mb={spacing.stackSpacing.lg}
              border="1px solid"
              borderColor="yellow.200"
            >
              <HStack
                justify="space-between"
                wrap="wrap"
                spacing={spacing.gaps.md}
              >
                <HStack spacing={spacing.gaps.sm}>
                  <FiAlertCircle color="#D69E2E" />
                  <Text
                    fontSize={fontSizes.body.small}
                    fontWeight="medium"
                    color="yellow.800"
                  >
                    Unconfigured Leave Types:
                  </Text>
                  <Text fontSize={fontSizes.body.small} color="yellow.700">
                    {unconfiguredTypes
                      .map((t) => LEAVE_TYPE_LABELS[t])
                      .join(", ")}
                  </Text>
                </HStack>
              </HStack>
            </Box>
          )}

          {/* DESKTOP VIEW - Table Layout */}
          {showTableView && (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th fontSize="xs" fontWeight="bold">
                      Leave Type
                    </Th>
                    <Th fontSize="xs" fontWeight="bold" isNumeric>
                      Annual Days
                    </Th>
                    <Th fontSize="xs" fontWeight="bold" isNumeric>
                      Notice Days
                    </Th>
                    <Th fontSize="xs" fontWeight="bold">
                      Reapplication
                    </Th>
                    <Th fontSize="xs" fontWeight="bold">
                      Description
                    </Th>
                    <Th fontSize="xs" fontWeight="bold" textAlign="right">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {configs.map((config) => (
                    <Tr key={config.leave_type} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <Text fontWeight="bold" fontSize="sm">
                          {LEAVE_TYPE_LABELS[config.leave_type]}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Badge
                          colorScheme="blue"
                          fontSize="sm"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {config.annual_days} days
                        </Badge>
                      </Td>
                      <Td isNumeric>
                        {config.min_notice_days > 0 ? (
                          <Text fontSize="sm">
                            {config.min_notice_days} days
                          </Text>
                        ) : (
                          <Text fontSize="sm" color="gray.400">
                            No notice
                          </Text>
                        )}
                      </Td>
                      <Td>{getStatusBadge(config.can_reapply)}</Td>
                      <Td>
                        <Text
                          fontSize="xs"
                          color="gray.600"
                          maxW="250px"
                          noOfLines={1}
                        >
                          {config.description ||
                            LEAVE_TYPE_DESCRIPTIONS[config.leave_type]}
                        </Text>
                      </Td>
                      <Td textAlign="right">
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            size="xs"
                            variant="ghost"
                          />
                          <MenuList fontSize="sm" minW="160px">
                            <MenuItem
                              icon={<FiEdit2 />}
                              onClick={() => handleEdit(config)}
                            >
                              Edit Configuration
                            </MenuItem>
                            <MenuItem
                              icon={<FiTrash2 />}
                              color="red.500"
                              onClick={() => setConfigToDelete(config)}
                            >
                              Delete Configuration
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}

          {/* MOBILE VIEW - Card Layout */}
          {!showTableView && (
            <SimpleGrid columns={1} spacing={spacing.gridGaps.normal}>
              {configs.map((config) => (
                <Card key={config.leave_type} variant="outline" size="sm">
                  <CardBody p={spacing.card}>
                    <VStack spacing={spacing.stackSpacing.sm} align="stretch">
                      <HStack justify="space-between">
                        <Heading size="sm" fontSize="md">
                          {LEAVE_TYPE_LABELS[config.leave_type]}
                        </Heading>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList fontSize={fontSizes.body.small}>
                            <MenuItem
                              icon={<FiEdit2 />}
                              onClick={() => handleEdit(config)}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              icon={<FiTrash2 />}
                              color="red.500"
                              onClick={() => setConfigToDelete(config)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>

                      <HStack justify="space-between">
                        <Text
                          fontSize={fontSizes.body.caption}
                          color="gray.500"
                        >
                          Annual Days:
                        </Text>
                        <Badge
                          colorScheme="blue"
                          fontSize="sm"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {config.annual_days} days
                        </Badge>
                      </HStack>

                      <HStack justify="space-between">
                        <Text
                          fontSize={fontSizes.body.caption}
                          color="gray.500"
                        >
                          Notice Period:
                        </Text>
                        <Text fontSize={fontSizes.body.small}>
                          {config.min_notice_days > 0
                            ? `${config.min_notice_days} days`
                            : "No notice"}
                        </Text>
                      </HStack>

                      <HStack justify="space-between">
                        <Text
                          fontSize={fontSizes.body.caption}
                          color="gray.500"
                        >
                          Reapplication:
                        </Text>
                        {getStatusBadge(config.can_reapply)}
                      </HStack>

                      <Box>
                        <Text
                          fontSize={fontSizes.body.caption}
                          color="gray.500"
                        >
                          Description:
                        </Text>
                        <Text
                          fontSize={fontSizes.body.small}
                          color="gray.600"
                          mt={1}
                        >
                          {config.description ||
                            LEAVE_TYPE_DESCRIPTIONS[config.leave_type]}
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}

          {/* No Configurations State */}
          {configs.length === 0 && (
            <Center py={spacing.section.base}>
              <VStack spacing={spacing.stackSpacing.md}>
                <Text fontSize={fontSizes.body.medium} color="gray.500">
                  No leave type configurations found
                </Text>
                <Text fontSize={fontSizes.body.small} color="gray.400">
                  Use the "Add Configuration" button to configure leave types
                </Text>
              </VStack>
            </Center>
          )}
        </CardBody>
      </Card>

      {/* Create Configuration Modal */}
      <LeaveTypeConfigForm
        leaveType={selectedLeaveType}
        existingConfig={
          selectedLeaveType
            ? configs.find((c) => c.leave_type === selectedLeaveType)
            : null
        }
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedLeaveType(null);
        }}
        onSuccess={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={!!configToDelete}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfigToDelete(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader
              fontSize={fontSizes.headings.card}
              fontWeight="bold"
            >
              Delete Configuration
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will permanently delete the configuration for{" "}
              <Box as="span" fontWeight="bold">
                {configToDelete && LEAVE_TYPE_LABELS[configToDelete.leave_type]}
              </Box>
              .
              {configToDelete?.annual_days > 0 && (
                <Text fontSize={fontSizes.body.small} color="red.500" mt={2}>
                  ⚠️ This will also affect leave balance calculations for this
                  leave type.
                </Text>
              )}
            </AlertDialogBody>

            <AlertDialogFooter gap={spacing.gaps.md}>
              <Button
                ref={cancelRef}
                onClick={() => setConfigToDelete(null)}
                variant="ghost"
                size={buttonSize}
                width={{ base: "100%", sm: "auto" }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                size={buttonSize}
                width={{ base: "100%", sm: "auto" }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default LeaveTypeConfigManagement;
