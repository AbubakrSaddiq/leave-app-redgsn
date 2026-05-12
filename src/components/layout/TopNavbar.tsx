// ============================================
// TopNavbar - Sticky Top Navigation Bar
// Header with breadcrumbs, notifications, and user menu
// ============================================

import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Badge,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiChevronRight,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { motion } from "framer-motion";

interface TopNavbarProps {
  onMenuClick?: () => void;
  title?: string;
}

const MotionBox = motion(Box);

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/apply-leave": "Apply Leave",
  "/my-applications": "My Applications",
  "/approvals": "Approvals",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick, title }) => {
  const location = useLocation();
  const { profile } = useAuth();
  const showMenuButton = useBreakpointValue({ base: true, lg: false });

  // Get page title
  const pageTitle = title || breadcrumbMap[location.pathname] || "Dashboard";

  return (
    <MotionBox
      as="header"
      position="sticky"
      top={0}
      zIndex={100}
      bg="white"
      borderBottom="1px solid"
      borderColor="naseni.gray.200"
      boxShadow="sm"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <HStack
        height="70px"
        px={{ base: 4, md: 8 }}
        justify="space-between"
        spacing={4}
      >
        {/* Left section: Menu button + Breadcrumb */}
        <HStack spacing={4} flex={1} minW={0}>
          {showMenuButton && (
            <IconButton
              aria-label="Toggle menu"
              icon={<FiMenu />}
              variant="ghost"
              onClick={onMenuClick}
              size="lg"
              color="naseni.primary"
              _hover={{ bg: "naseni.light" }}
            />
          )}

          {/* Breadcrumb */}
          <VStack spacing={0} align="flex-start" minW={0}>
            <Text
              fontSize="sm"
              color="naseni.gray.500"
              fontWeight="500"
              display={{ base: "none", md: "block" }}
            >
              Leave Management System
            </Text>
            <Text
              fontSize="lg"
              fontWeight="700"
              color="naseni.primary"
              noOfLines={1}
            >
              {pageTitle}
            </Text>
          </VStack>
        </HStack>

        {/* Right section: Notifications + User menu */}
        <HStack spacing={4}>
          {/* Notifications */}
          {/* <Menu>
            <MenuButton
              as={IconButton}
              icon={
                <Box position="relative">
                  <Icon as={FiBell} boxSize={5} color="naseni.gray.600" />
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    fontSize="10px"
                    colorScheme="red"
                  >
                    3
                  </Badge>
                </Box>
              }
              variant="ghost"
              size="lg"
              _hover={{ bg: "naseni.light" }}
            />
            <MenuList>
              <MenuItem>New leave application received</MenuItem>
              <MenuItem>Your leave was approved</MenuItem>
              <MenuItem>Reminder: Submit desired months</MenuItem>
              <Divider my={2} />
              <MenuItem fontSize="sm" color="naseni.gray.500">
                View all notifications
              </MenuItem>
            </MenuList>
          </Menu> */}

          {/* User menu */}
          {/* <Menu placement="bottom-end">
            <MenuButton
              as={Box}
              cursor="pointer"
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.2s"
            >
              <HStack spacing={2}>
                <VStack
                  spacing={0}
                  align="flex-end"
                  display={{ base: "none", sm: "flex" }}
                >
                  <Text fontSize="xs" fontWeight="600" color="naseni.dark">
                    {profile?.full_name}
                  </Text>
                  <Text
                    fontSize="9px"
                    color="naseni.gray.500"
                    textTransform="capitalize"
                  >
                    {profile?.role}
                  </Text>
                </VStack>
                <Avatar
                  size="sm"
                  name={profile?.full_name}
                  src={profile?.avatar_url}
                  boxShadow="sm"
                />
              </HStack>
            </MenuButton>

            <MenuList>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <Divider my={2} />
              <MenuItem
                icon={<FiLogOut />}
                color="naseni.danger"
                onClick={() => authService.signOut()}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu> */}
        </HStack>
      </HStack>
    </MotionBox>
  );
};

export default TopNavbar;
