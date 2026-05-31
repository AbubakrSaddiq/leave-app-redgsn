// File: src/components/admin/UserCard.tsx
// ============================================
// User Card Component - Mobile Friendly
// ============================================

import React from "react";
import {
  Box,
  Card,
  CardBody,
  HStack,
  VStack,
  Text,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiPower, FiMoreVertical } from "react-icons/fi";
import type { User, Department, Designation } from "@/types/user";
import { spacing, fontSizes, componentSizes } from "@/styles/responsive";

interface UserCardProps {
  user: User;
  departments: Department[];
  designations: Designation[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  departments,
  designations,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const avatarSize = useBreakpointValue({ base: "sm", md: "xs" });
  const badgeSize = useBreakpointValue({ base: "sm", md: "md" });

  const department = departments.find((d) => d.id === user.department_id);
  const designation = designations.find((d) => d.id === user.designation_id);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "purple";
      case "hr":
        return "blue";
      case "director":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Card
      variant="elevated"
      size="sm"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
    >
      <CardBody p={spacing.card}>
        <VStack spacing={spacing.stackSpacing.sm} align="stretch">
          {/* Header with Avatar and Menu */}
          <HStack justify="space-between" align="flex-start">
            <HStack spacing={spacing.gaps.md}>
              <Avatar
                size={avatarSize}
                name={user.full_name}
                src={user.avatar_url || undefined}
              />
              <Box>
                <Text
                  fontWeight="bold"
                  fontSize={fontSizes.body.medium}
                  lineHeight="short"
                >
                  {user.full_name}
                </Text>
                <Text
                  fontSize={fontSizes.body.small}
                  color="gray.500"
                  wordBreak="break-all"
                >
                  {user.email}
                </Text>
              </Box>
            </HStack>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                size={componentSizes.buttons.xs}
                variant="ghost"
                aria-label="User actions"
              />
              <MenuList fontSize={fontSizes.body.small}>
                <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(user)}>
                  Edit Profile
                </MenuItem>
                <MenuItem
                  icon={<FiPower />}
                  onClick={() => onToggleStatus(user)}
                >
                  {user.is_active ? "Deactivate Account" : "Activate Account"}
                </MenuItem>
                <MenuItem
                  icon={<FiTrash2 />}
                  color="red.500"
                  onClick={() => onDelete(user)}
                >
                  Delete User
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* Role Badge */}
          <Box>
            <Badge
              colorScheme={getRoleColor(user.role)}
              variant="subtle"
              fontSize={badgeSize}
              px={spacing.gaps.sm}
              py={spacing.gaps.xs}
              borderRadius="full"
              textTransform="capitalize"
            >
              {user.role}
            </Badge>
          </Box>

          {/* Department & Designation Info */}
          <VStack
            spacing={spacing.gaps.xs}
            align="stretch"
            mt={spacing.gaps.xs}
          >
            {(department || designation) && (
              <Text fontSize={fontSizes.body.small} color="gray.600">
                {department?.name || "No department"}
                {designation && ` • ${designation.name}`}
              </Text>
            )}
            <HStack justify="space-between" align="center">
              <Badge
                variant="dot"
                colorScheme={user.is_active ? "green" : "red"}
                fontSize={fontSizes.body.small}
              >
                {user.is_active ? "Active" : "Disabled"}
              </Badge>
              <Text fontSize={fontSizes.body.caption} color="gray.400">
                ID: {user.id.slice(0, 8)}...
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
