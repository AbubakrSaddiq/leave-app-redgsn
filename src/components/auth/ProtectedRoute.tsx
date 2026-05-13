import React from "react";
import { Center, Spinner, VStack, Text, Box } from "@chakra-ui/react";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "./LoginForm";
import { LandingPage } from "@/components/pages/LandingPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: limit access to specific roles (e.g., ['director', 'hr'])
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { profile, isLoading } = useAuth();

  // 1. Loading state while checking session
  if (isLoading) {
    return (
      <Center h="100vh" w="100%">
        <VStack spacing={4} align="center">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontWeight="medium" color="gray.600">
            Verifying session...
          </Text>
        </VStack>
      </Center>
    );
  }

  // 2. Not logged in: Show Login Form instead of the page
  if (!profile) {
    return (
      <Box w="100%" minH="100vh">
        {/* <LoginForm /> */}
        <LandingPage />
      </Box>
    );
  }

  // 3. Role-based access control (RBAC)
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return (
      <Center h="100vh">
        <VStack spacing={4} textAlign="center" p={8}>
          <Text fontSize="5xl">🚫</Text>
          <Text fontSize="xl" fontWeight="bold">
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

  // 4. Authorized: Show the protected content
  return <>{children}</>;
};
