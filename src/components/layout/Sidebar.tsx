// ============================================
// Sidebar - Desktop Navigation
// Fixed left sidebar with navigation menu
// ============================================

import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Button,
  useBreakpointValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiHome,
  FiEdit,
  FiFileText,
  FiCheckCircle,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { NavItem } from "./NavItem";
import { motion } from "framer-motion";

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const MotionBox = motion(Box);

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onCollapse,
}) => {
  const { profile } = useAuth();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const containerVariants = {
    hidden: { x: -280 },
    visible: {
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const sidebarWidth = isCollapsed ? "80px" : "280px";

  const navigationItems = [
    { icon: FiHome, label: "Dashboard", href: "/" },
    { icon: FiEdit, label: "Apply Leave", href: "/apply-leave" },
    { icon: FiFileText, label: "My Applications", href: "/my-applications" },
    ...(profile?.role === "director" || profile?.role === "hr"
      ? [{ icon: FiCheckCircle, label: "Approvals", href: "/approvals" }]
      : []),
    ...(profile?.role === "admin" || profile?.role === "hr"
      ? [{ icon: FiBarChart2, label: "Analytics", href: "/analytics" }]
      : []),
    { icon: FiSettings, label: "Settings", href: "/settings" },
  ];

  return (
    <MotionBox
      as="nav"
      position="fixed"
      left={0}
      top={0}
      height="100vh"
      width={sidebarWidth}
      bg="white"
      borderRight="1px solid"
      borderColor="naseni.gray.200"
      transition="width 0.3s ease"
      boxShadow="sm"
      zIndex={1000}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <VStack height="100%" spacing={0} justify="space-between" pt={6} pb={6}>
        {/* Header */}
        <Box width="100%" px={4} mb={6}>
          <HStack spacing={3} justify={isCollapsed ? "center" : "flex-start"}>
            <Box
              width="48px"
              height="48px"
              bg="naseni.primary"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
              fontSize="lg"
              flexShrink={0}
            >
              N
            </Box>
            {!isCollapsed && (
              <VStack spacing={0} align="flex-start">
                <Text fontSize="sm" fontWeight="bold" color="naseni.primary">
                  NASENI
                </Text>
                <Text fontSize="10px" color="naseni.gray.500">
                  Leave System
                </Text>
              </VStack>
            )}
          </HStack>
        </Box>

        {/* Navigation Items */}
        <VStack
          width="100%"
          spacing={1}
          align="stretch"
          flex={1}
          overflow="auto"
        >
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </VStack>

        {/* User Profile Section */}
        <Box width="100%" px={2}>
          <Divider mb={4} />

          {profile && (
            <Menu placement="top-start">
              <Tooltip label="User menu" openDelay={300}>
                <MenuButton
                  as={Button}
                  width="100%"
                  height="auto"
                  p={3}
                  variant="ghost"
                  justifyContent={isCollapsed ? "center" : "flex-start"}
                  _hover={{ bg: "naseni.light" }}
                  borderRadius="lg"
                >
                  <HStack spacing={2} width="100%">
                    <Avatar
                      size="sm"
                      name={profile.full_name}
                      src={profile.avatar_url}
                    />
                    {!isCollapsed && (
                      <>
                        <VStack
                          spacing={0}
                          align="flex-start"
                          flex={1}
                          minW={0}
                        >
                          <Text
                            fontSize="xs"
                            fontWeight="600"
                            color="naseni.dark"
                            noOfLines={1}
                          >
                            {profile.full_name}
                          </Text>
                          <Text
                            fontSize="9px"
                            color="naseni.gray.500"
                            textTransform="capitalize"
                            noOfLines={1}
                          >
                            {profile.role}
                          </Text>
                        </VStack>
                        <Icon
                          as={FiChevronDown}
                          boxSize={4}
                          color="naseni.gray.400"
                        />
                      </>
                    )}
                  </HStack>
                </MenuButton>
              </Tooltip>

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
            </Menu>
          )}
        </Box>
      </VStack>
    </MotionBox>
  );
};

export default Sidebar;
