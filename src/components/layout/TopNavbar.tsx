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
import { NotificationBell } from "@/components/notifications/NotificationBell";

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
          <NotificationBell />
        </HStack>
      </HStack>
    </MotionBox>
  );
};

export default TopNavbar;
