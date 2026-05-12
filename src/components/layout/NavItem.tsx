// ============================================
// NavItem - Sidebar Navigation Item
// Reusable navigation link with active state
// ============================================

import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  HStack,
  Icon,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface NavItemProps {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  isCollapsed?: boolean;
  onClick?: () => void;
  badge?: number | string;
}

const MotionBox = motion(Box);

export const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  isCollapsed = false,
  onClick,
  badge,
}) => {
  const location = useLocation();
  const isActive = location.pathname === href || 
                   (href !== '/' && location.pathname.startsWith(href));

  const itemVariants = {
    rest: { x: 0, opacity: 1 },
    hover: { x: 4 },
  };

  const indicatorVariants = {
    active: { width: '4px', opacity: 1 },
    inactive: { width: '0px', opacity: 0 },
  };

  const content = (
    <HStack
      as={RouterLink}
      to={href}
      spacing={3}
      px={4}
      py={3}
      mx={2}
      borderRadius="lg"
      cursor="pointer"
      position="relative"
      transition="all 0.2s"
      bg={isActive ? 'naseni.light' : 'transparent'}
      _hover={{
        bg: isActive ? 'naseni.light' : '#f0f4f8',
      }}
      onClick={onClick}
      textDecoration="none"
      _activeLink={{
        textDecoration: 'none',
      }}
    >
      {/* Active indicator */}
      <motion.div
        initial={false}
        animate={isActive ? 'active' : 'inactive'}
        variants={indicatorVariants}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'var(--chakra-colors-naseni-secondary)',
          borderRadius: '0 6px 6px 0',
        }}
      />

      {/* Icon */}
      <Icon
        as={icon}
        boxSize={5}
        color={isActive ? 'naseni.secondary' : 'naseni.gray.600'}
        transition="color 0.2s"
      />

      {/* Label */}
      {!isCollapsed && (
        <Text
          fontSize="sm"
          fontWeight={isActive ? '600' : '500'}
          color={isActive ? 'naseni.primary' : 'naseni.gray.700'}
          transition="color 0.2s"
          whiteSpace="nowrap"
          flex={1}
        >
          {label}
        </Text>
      )}

      {/* Badge */}
      {badge && !isCollapsed && (
        <Box
          bg="naseni.danger"
          color="white"
          fontSize="xs"
          fontWeight="bold"
          px={2}
          py={0.5}
          borderRadius="full"
          minW="24px"
          textAlign="center"
        >
          {badge}
        </Box>
      )}
    </HStack>
  );

  // If collapsed, wrap in tooltip
  if (isCollapsed) {
    return (
      <Tooltip label={label} placement="right" openDelay={300}>
        {content}
      </Tooltip>
    );
  }

  return content;
};
