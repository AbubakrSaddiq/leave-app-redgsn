// src/components/auth/ProtectedRoute.tsx
import React from "react";
import { Center, Spinner, VStack, Text, Box } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { LoginPage } from "./LoginPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: limit access to specific roles (e.g., ['director', 'hr'])
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { profile, isLoading } = useAuth();

  //  Loading state while checking session
  if (isLoading) {
    return (
      <Center h="100vh" w="100%" bg="white">
        <VStack spacing={4} align="center">
          <Spinner size="xl" color="naseni.primary" thickness="4px" />
          <Text fontWeight="medium" color="gray.600">
            Verifying session...
          </Text>
        </VStack>
      </Center>
    );
  }

  // Not logged in: Show the login page
  if (!profile) {
    return <LoginPage />;
  }

  // 3. Role-based access control (RBAC)
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return (
      <Center h="100vh" bg="white">
        <VStack spacing={4} textAlign="center" p={8}>
          <Text fontSize="5xl">🚫</Text>
          <Text fontSize="xl" fontWeight="bold" color="naseni.primary">
            Access Denied
          </Text>
          <Text color="gray.600">
            You do not have the required permissions to view this page.
            <br />
            Required: <strong>{allowedRoles.join(" or ")}</strong>
          </Text>
        </VStack>
      </Center>
    );
  }

  // Authorized: Show the protected content
  return <>{children}</>;
};
