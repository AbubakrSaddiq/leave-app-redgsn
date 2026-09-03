// ============================================
// AppRoutes - React Router Configuration
// Central route management
// ============================================

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import DashboardPage from "@/components/pages/DashboardPage";
import ApplyLeavePage from "@/components/pages/ApplyLeavePage";
import MyApplicationsPage from "@/components/pages/MyApplicationsPage";
import ApprovalsPage from "@/components/pages/ApprovalsPage";
import AnalyticsPage from "@/components/pages/AnalyticsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import LandingPage from "@/components/pages/LandingPage";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { NotificationsPage } from "@/components/notifications/NotificationsPage";
// Import the admin components for nested routes
import { UserManagement } from "@/components/admin/UserManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { DesignationManagement } from "@/components/admin/DesignationManagement";
import { DesiredMonthsAdminView } from "@/components/desiredMonths/DesiredMonthsAdminView";
import { LeaveAllocationManagement } from "@/components/admin/LeaveAllocationManagement";
import { ReportsPage } from "@/components/reports/ReportsPage";
import { LeaveTypeConfigManagement } from "@/components/admin/LeaveTypeConfigManagement";
import { ProfilePage } from "@/components/profile/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "apply-leave",
        element: <ApplyLeavePage />,
      },
      {
        path: "my-applications",
        element: <MyApplicationsPage />,
      },
      {
        path: "approvals",
        element: (
          <ProtectedRoute allowedRoles={["director", "hr", "admin"]}>
            <ApprovalsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute allowedRoles={["director", "hr", "admin"]}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      // Settings - Main route with nested routes
      {
        path: "settings",
        element: <SettingsPage />,
        children: [
          {
            index: true,
            element: <SettingsPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "departments",
            element: <DepartmentManagement />,
          },
          {
            path: "designations",
            element: <DesignationManagement />,
          },
          {
            path: "leave-config",
            element: <LeaveTypeConfigManagement />,
          },
          {
            path: "desired-months",
            element: <DesiredMonthsAdminView />,
          },
          {
            path: "allocations",
            element: <LeaveAllocationManagement />,
          },
          {
            path: "reports",
            element: <ReportsPage />,
          },
        ],
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
