// ============================================
// MobileDrawer - Mobile Navigation Drawer
// Slide-out navigation for mobile/tablet
// ============================================

import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Box,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Button,
  Icon,
} from '@chakra-ui/react';
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
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import { NavItem } from './NavItem';
import { motion } from 'framer-motion';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuth();

  const navigationItems = [
    { icon: FiHome, label: 'Dashboard', href: '/' },
    { icon: FiEdit, label: 'Apply Leave', href: '/apply-leave' },
    { icon: FiFileText, label: 'My Applications', href: '/my-applications' },
    ...(profile?.role === 'director' || profile?.role === 'hr'
      ? [{ icon: FiCheckCircle, label: 'Approvals', href: '/approvals' }]
      : []),
    ...(profile?.role === 'admin' || profile?.role === 'hr'
      ? [{ icon: FiBarChart2, label: 'Analytics', href: '/analytics' }]
      : []),
    { icon: FiSettings, label: 'Settings', href: '/settings' },
  ];

  const handleNavClick = () => {
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
      <DrawerOverlay />
      <DrawerContent bg="white">
        <DrawerCloseButton />

        <VStack height="100%" spacing={0} justify="space-between" pt={8} pb={6} px={4}>
          {/* Header */}
          <Box width="100%" mb={8}>
            <HStack spacing={3}>
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
                fontSize="xl"
              >
                N
              </Box>
              <VStack spacing={0} align="flex-start">
                <Text fontSize="sm" fontWeight="bold" color="naseni.primary">
                  NASENI
                </Text>
                <Text fontSize="10px" color="naseni.gray.500">
                  Leave Management
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Navigation Items */}
          <VStack width="100%" spacing={1} align="stretch" flex={1}>
            {navigationItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                onClick={handleNavClick}
              />
            ))}
          </VStack>

          {/* User Profile Section */}
          <Box width="100%">
            <Divider mb={4} />

            {profile && (
              <Menu placement="top-start">
                <MenuButton
                  as={Button}
                  width="100%"
                  height="auto"
                  p={3}
                  variant="ghost"
                  justifyContent="flex-start"
                  _hover={{ bg: 'naseni.light' }}
                  borderRadius="lg"
                >
                  <HStack spacing={2} width="100%">
                    <Avatar
                      size="sm"
                      name={profile.full_name}
                      src={profile.avatar_url}
                    />
                    <VStack spacing={0} align="flex-start" flex={1} minW={0}>
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
                    <Icon as={FiChevronDown} boxSize={4} color="naseni.gray.400" />
                  </HStack>
                </MenuButton>

                <MenuList>
                  <MenuItem icon={<FiUser />}>Profile</MenuItem>
                  <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                  <Divider my={2} />
                  <MenuItem
                    icon={<FiLogOut />}
                    color="naseni.danger"
                    onClick={() => {
                      authService.signOut();
                      onClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Box>
        </VStack>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
