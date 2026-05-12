// ============================================
// DashboardLayout - Main Layout Container
// Combines sidebar, navbar, and content area
// ============================================

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { TopNavbar } from './TopNavbar';

const MotionBox = motion(Box);

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Calculate margin based on sidebar state and screen size
  const sidebarWidth = sidebarCollapsed ? '80px' : '280px';
  const showSidebar = !isMobile;

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <Box minHeight="100vh" bg="naseni.light">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onCollapse={setSidebarCollapsed}
        />
      )}

      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={mobileDrawerOpen} 
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <Box
        transition="margin-left 0.3s ease"
        marginLeft={showSidebar ? sidebarWidth : 0}
        display="flex"
        flexDirection="column"
        minHeight="100vh"
      >
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setMobileDrawerOpen(true)} />

        {/* Page Content */}
        <MotionBox
          as="main"
          flex={1}
          px={{ base: 4, md: 8 }}
          py={8}
          overflow="auto"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <Outlet />
        </MotionBox>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
