// ============================================
// AppRoutes - React Router Configuration
// Central route management
// ============================================

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Page imports
import DashboardPage from "@/components/pages/DashboardPage";
import ApplyLeavePage from "@/components/pages/ApplyLeavePage";
import MyApplicationsPage from "@/components/pages/MyApplicationsPage";
import ApprovalsPage from "@/components/pages/ApprovalsPage";
import AnalyticsPage from "@/components/pages/AnalyticsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import LandingPage from "@/components/pages/LandingPage";

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
          <ProtectedRoute allowedRoles={["director", "hr"]}>
            <ApprovalsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute allowedRoles={["admin", "hr"]}>
            <AnalyticsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
