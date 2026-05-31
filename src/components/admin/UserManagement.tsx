// File: src/components/admin/UserManagement.tsx (REFACTORED)
// ============================================
// User Management Component - Fully Responsive
// Using centralized responsive configuration
// ============================================

import React, { useState, useCallback, useRef } from "react";
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
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useBreakpointValue,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  SimpleGrid,
  Center,
} from "@chakra-ui/react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useUsers, useDepartments, useDesignations } from "@/hooks/useUsers";
import { UserCard } from "./UserCard";
import { UserForm } from "./UserForm";
import {
  spacing,
  fontSizes,
  componentSizes,
  gridPatterns,
  useIsMobile,
} from "@/styles/responsive";
import type { User, UserFormData } from "@/types/user";

export const UserManagement: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const isMobile = useIsMobile();
  const gridColumns = useBreakpointValue(gridPatterns.cards);
  const searchSize = useBreakpointValue({ base: "md", md: "lg" });

  const {
    users,
    loading,
    filters,
    setFilters,
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
  } = useUsers();

  const { departments } = useDepartments();
  const { designations } = useDesignations();

  const handleEdit = useCallback(
    (user: User) => {
      setSelectedUser(user);
      onOpen();
    },
    [onOpen],
  );

  const handleDelete = useCallback(async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id, userToDelete.full_name);
      setUserToDelete(null);
    }
  }, [userToDelete, deleteUser]);

  const handleToggleStatus = useCallback(
    async (user: User) => {
      await toggleStatus(user.id, user.is_active, user.full_name);
    },
    [toggleStatus],
  );

  const handleFormSubmit = useCallback(
    async (data: UserFormData) => {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
      } else {
        await createUser(data);
      }
      setSelectedUser(null);
    },
    [selectedUser, createUser, updateUser],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ search: e.target.value });
    },
    [setFilters],
  );

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: debouncedSearch });
    }, 300);
    return () => clearTimeout(timer);
  }, [debouncedSearch, setFilters]);

  return (
    <VStack align="stretch" spacing={spacing.stackSpacing.lg}>
      <Card variant="elevated" borderRadius="xl" shadow="sm">
        <CardHeader
          borderBottomWidth="1px"
          pb={spacing.gaps.md}
          flexDirection={{ base: "column", sm: "row" }}
        >
          <HStack
            justify="space-between"
            wrap="wrap"
            spacing={spacing.stackSpacing.md}
          >
            <VStack align="start" spacing={spacing.gaps.xs}>
              <Heading
                size={isMobile ? "sm" : "md"}
                fontSize={fontSizes.headings.card}
              >
                Staff Directory
              </Heading>
              <Text fontSize={fontSizes.body.small} color="gray.500">
                Manage account access and departmental assignments
              </Text>
            </VStack>

            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={() => {
                setSelectedUser(null);
                onOpen();
              }}
              size={componentSizes.buttons.md}
              width={{ base: "100%", sm: "auto" }}
            >
              New User
            </Button>
          </HStack>
        </CardHeader>

        <CardBody>
          {/* Search Input */}
          <InputGroup
            mb={spacing.stackSpacing.lg}
            maxW={{ base: "100%", md: "400px" }}
          >
            <InputLeftElement>
              <FiSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setDebouncedSearch(e.target.value)}
              size={searchSize}
              borderRadius="full"
              bg="gray.50"
              _focus={{ bg: "white", borderColor: "blue.400" }}
            />
          </InputGroup>

          {/* Loading State */}
          {loading ? (
            <Center py={spacing.section.base}>
              <VStack spacing={spacing.stackSpacing.sm}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text fontSize={fontSizes.body.small} color="gray.500">
                  Loading staff directory...
                </Text>
              </VStack>
            </Center>
          ) : users.length === 0 ? (
            // Empty State
            <Center py={spacing.section.base}>
              <VStack spacing={spacing.stackSpacing.md}>
                <Text fontSize={fontSizes.body.medium} color="gray.500">
                  No users found
                </Text>
                {filters.search && (
                  <Button
                    size={componentSizes.buttons.sm}
                    variant="ghost"
                    onClick={() => setFilters({ search: "" })}
                  >
                    Clear search
                  </Button>
                )}
              </VStack>
            </Center>
          ) : (
            // User Cards Grid - Mobile Friendly
            <SimpleGrid columns={gridColumns} spacing={spacing.gridGaps.normal}>
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  departments={departments}
                  designations={designations}
                  onEdit={handleEdit}
                  onDelete={setUserToDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </SimpleGrid>
          )}

          {/* User Count */}
          {!loading && users.length > 0 && (
            <Text
              fontSize={fontSizes.body.small}
              color="gray.400"
              mt={spacing.stackSpacing.md}
              textAlign="center"
            >
              Showing {users.length} user{users.length !== 1 ? "s" : ""}
            </Text>
          )}
        </CardBody>
      </Card>

      {/* User Form Modal */}
      <UserForm
        user={selectedUser}
        departments={departments}
        designations={designations}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={!!userToDelete}
        leastDestructiveRef={cancelRef}
        onClose={() => setUserToDelete(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader
              fontSize={fontSizes.headings.card}
              fontWeight="bold"
            >
              Remove Staff Member
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will permanently delete{" "}
              <Box as="span" fontWeight="bold">
                {userToDelete?.full_name}
              </Box>{" "}
              and all their records. This cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter gap={spacing.gaps.md}>
              <Button
                ref={cancelRef}
                onClick={() => setUserToDelete(null)}
                variant="ghost"
                size={componentSizes.buttons.md}
                width={{ base: "50%", sm: "auto" }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                size={componentSizes.buttons.md}
                width={{ base: "50%", sm: "auto" }}
              >
                Delete Forever
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default UserManagement;
