// File: src/pages/SettingsPage.tsx (REFACTORED)
// ============================================
// SettingsPage - User Settings & Admin Controls
// Wraps profile and admin components
// Mobile: Dropdown navigation for admin
// Desktop: Horizontal tabs
// ============================================

import React, { useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Heading,
  Text,
  Select,
  HStack,
  Icon,
  useBreakpointValue,
  Divider,
  Container,
} from "@chakra-ui/react";
import {
  FiUser,
  FiUsers,
  FiBriefcase,
  FiAward,
  FiCalendar,
  FiPieChart,
  FiSettings,
  FiShield,
  FiLayers,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { UserManagement } from "@/components/admin/UserManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { DesignationManagement } from "@/components/admin/DesignationManagement";
import { DesiredMonthsAdminView } from "@/components/desiredMonths/DesiredMonthsAdminView";
import { LeaveAllocationManagement } from "@/components/admin/LeaveAllocationManagement";
import { ReportsPage } from "@/components/reports/ReportsPage";
import { LeaveTypeConfigManagement } from "@/components/admin/LeaveTypeConfigManagement";
import {
  spacing,
  fontSizes,
  componentSizes,
  useIsMobile,
} from "@/styles/responsive";

// Tab configuration for better maintainability
const ADMIN_TABS = [
  { id: "profile", label: "Profile", icon: FiUser, component: ProfilePage },
  { id: "users", label: "Users", icon: FiUsers, component: UserManagement },
  {
    id: "departments",
    label: "Departments",
    icon: FiBriefcase,
    component: DepartmentManagement,
  },
  {
    id: "designations",
    label: "Designations",
    icon: FiAward,
    component: DesignationManagement,
  },
  {
    id: "leaveConfig",
    label: "Leave Config",
    icon: FiLayers,
    component: LeaveTypeConfigManagement,
  },
  {
    id: "desiredMonths",
    label: "Desired Months",
    icon: FiCalendar,
    component: DesiredMonthsAdminView,
  },
  {
    id: "allocations",
    label: "Allocations",
    icon: FiSettings,
    component: LeaveAllocationManagement,
  },
  { id: "reports", label: "Reports", icon: FiPieChart, component: ReportsPage },
];

const SettingsPage: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin" || profile?.role === "hr";
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState(0);

  // Responsive values
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const tabSize = useBreakpointValue({ base: "sm", md: "md" });
  const showMobileDropdown = useBreakpointValue({ base: true, md: false });
  const showDesktopTabs = useBreakpointValue({ base: false, md: true });

  // Get current component for mobile view
  const CurrentComponent = ADMIN_TABS[selectedTab]?.component || ProfilePage;

  // Handle tab change for mobile dropdown
  const handleMobileTabChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTab(parseInt(event.target.value, 10));
  };

  if (!isAdmin) {
    // Regular user view - just profile
    return (
      <Container maxW="container.lg" py={containerPadding}>
        <VStack spacing={spacing.stackSpacing.lg} align="stretch">
          <Box>
            <HStack spacing={spacing.gaps.md}>
              <Icon as={FiUser} boxSize={6} color="blue.500" />
              <Heading size={headingSize}>My Profile</Heading>
            </HStack>
            <Text
              fontSize={fontSizes.body.small}
              color="gray.500"
              mt={spacing.gaps.xs}
              pl={10}
            >
              Manage your personal information and account settings
            </Text>
          </Box>
          <Divider />
          <ProfilePage />
        </VStack>
      </Container>
    );
  }

  // Admin view - responsive tabs
  return (
    <Container maxW="container.xl" py={containerPadding}>
      <VStack spacing={spacing.stackSpacing.lg} align="stretch">
        {/* Header */}
        <Box>
          <HStack spacing={spacing.gaps.md}>
            <Icon as={FiShield} boxSize={6} color="blue.500" />
            <Heading size={headingSize}>Administration</Heading>
          </HStack>
          <Text
            fontSize={fontSizes.body.small}
            color="gray.500"
            mt={spacing.gaps.xs}
            pl={10}
          >
            Manage users, departments, leave allocations, and system settings
          </Text>
        </Box>

        <Divider />

        {/* Mobile Dropdown Navigation */}
        {showMobileDropdown && (
          <Box>
            <Select
              value={selectedTab}
              onChange={handleMobileTabChange}
              size={componentSizes.inputs.md}
              borderRadius="lg"
              bg="white"
              _focus={{ borderColor: "blue.400", shadow: "0 0 0 1px #3182ce" }}
            >
              {ADMIN_TABS.map((tab, index) => (
                <option key={tab.id} value={index}>
                  {tab.label}
                </option>
              ))}
            </Select>
            <Text
              fontSize={fontSizes.body.caption}
              color="gray.400"
              mt={spacing.gaps.xs}
              textAlign="center"
            >
              Select a section to manage
            </Text>
          </Box>
        )}

        {/* Desktop Tabs Navigation */}
        {showDesktopTabs && (
          <Tabs
            colorScheme="blue"
            variant="enclosed"
            isLazy
            size={tabSize}
            onChange={(index) => setSelectedTab(index)}
            defaultIndex={selectedTab}
          >
            <TabList
              overflowX="auto"
              overflowY="hidden"
              whiteSpace="nowrap"
              css={{
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  height: "4px",
                },
              }}
            >
              {ADMIN_TABS.map((tab) => (
                <Tab key={tab.id}>
                  <Icon as={tab.icon} mr={spacing.gaps.xs} boxSize={4} />
                  <Text as="span">{tab.label}</Text>
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {ADMIN_TABS.map((tab, index) => (
                <TabPanel
                  key={tab.id}
                  px={{ base: 2, md: 4 }}
                  py={{ base: 4, md: 6 }}
                >
                  <tab.component />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}

        {/* Mobile Content Display */}
        {showMobileDropdown && (
          <Box mt={spacing.stackSpacing.md}>
            <CurrentComponent />
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default SettingsPage;
