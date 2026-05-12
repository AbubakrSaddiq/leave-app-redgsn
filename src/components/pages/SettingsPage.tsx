// ============================================
// SettingsPage - User Settings & Admin Controls
// Wraps profile and admin components
// ============================================

import React from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { UserManagement } from "@/components/admin/UserManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { DesignationManagement } from "@/components/admin/DesignationManagement";
import { DesiredMonthsAdminView } from "@/components/desiredMonths/DesiredMonthsAdminView";
import { LeaveAllocationManagement } from "@/components/admin/LeaveAllocationManagement";
import { ReportsPage } from "@/components/reports/ReportsPage";

const SettingsPage: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin" || profile?.role === "hr";

  return (
    <VStack spacing={6} align="stretch">
      {isAdmin ? (
        // Admin Settings
        <Tabs colorScheme="blue" variant="enclosed" isLazy>
          <TabList>
            <Tab>Profile</Tab>
            <Tab>👥 Users</Tab>
            <Tab>🏢 Departments</Tab>
            <Tab>👔 Designations</Tab>
            <Tab>📅 Desired Months</Tab>
            <Tab>🗓️ Allocations</Tab>
            <Tab>📊 Reports</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ProfilePage />
            </TabPanel>
            <TabPanel>
              <UserManagement />
            </TabPanel>
            <TabPanel>
              <DepartmentManagement />
            </TabPanel>
            <TabPanel>
              <DesignationManagement />
            </TabPanel>
            <TabPanel>
              <DesiredMonthsAdminView />
            </TabPanel>
            <TabPanel>
              <LeaveAllocationManagement />
            </TabPanel>
            <TabPanel>
              <ReportsPage />
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        // User Settings
        <ProfilePage />
      )}
    </VStack>
  );
};

export default SettingsPage;
