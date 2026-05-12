import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Divider,
  Spinner,
  Center,
  Icon,
  Flex,
  Stack, // Added Stack for responsive direction
} from "@chakra-ui/react";
import { FiLogOut, FiUser, FiShield } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { LoginForm } from "../auth/LoginForm";

export const UserNav = () => {
  const { profile, isLoading } = useAuth();

  // 1. Loading State
  if (isLoading) {
    return (
      <Box
        p={{ base: 4, md: 6 }} // Responsive padding
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
      >
        <Center>
          <VStack spacing={3}>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="xs" color="gray.500">
              Authenticating...
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // 2. Authenticated State: Show Profile & Logout
  if (profile) {
    return (
      <Box
        p={{ base: 3, md: 4 }} // Slightly tighter padding on mobile to save screen real estate
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.100"
        w="100%" // Ensure it fills container width
      >
        <VStack align="stretch" spacing={{ base: 4, md: 3 }}>
          {/* Header Section: Profile Info */}
          <Flex
            align="center"
            justify="space-between"
            direction="row" // Keep profile info horizontal as it's usually compact
          >
            <HStack spacing={3} overflow="hidden">
              {" "}
              {/* Added overflow hidden to handle long emails */}
              <Center
                bg="blue.50"
                p={2}
                borderRadius="md"
                flexShrink={0} // Prevent icon from shrinking
                minW="40px"
                minH="40px" // Ensuring touch target/visual consistency
              >
                <Icon as={FiUser} color="blue.500" fontSize="lg" />
              </Center>
              <VStack align="start" spacing={0} overflow="hidden">
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  lineHeight="shorter"
                  isTruncated // Prevents layout break on very long names
                  maxW="full"
                >
                  {profile.full_name}
                </Text>
                <Text fontSize="xs" color="gray.500" isTruncated maxW="full">
                  {profile.email}
                </Text>
              </VStack>
            </HStack>
          </Flex>

          <Divider />

          {/* Actions Section: Badges & Logout */}
          <Stack
            /* Mobile: Stacks vertically to give badges and button room
               Desktop: Stays horizontal for compact sidebar feel
            */
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            spacing={3}
          >
            <Flex
              wrap="wrap" // Essential for multiple badges on narrow screens
              gap={2}
            >
              <Badge
                colorScheme="purple"
                variant="subtle"
                px={2}
                py={1} // Slightly taller for mobile legibility
                borderRadius="md"
              >
                <HStack spacing={1}>
                  <Icon as={FiShield} boxSize="12px" />
                  <Text fontSize="xs">{profile.role}</Text>
                </HStack>
              </Badge>

              {profile.department && (
                <Badge
                  colorScheme="gray"
                  variant="outline"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                >
                  {profile.department.code}
                </Badge>
              )}
            </Flex>

            <Button
              leftIcon={<FiLogOut />}
              /* Mobile: Larger button (sm) for 44px-ish height tap target
                 Desktop: Returns to compact (xs)
              */
              size={{ base: "sm", md: "xs" }}
              variant="ghost"
              colorScheme="red"
              onClick={() => authService.signOut()}
              w={{ base: "full", sm: "auto" }} // Full width button on mobile for easier tapping
              justifyContent={{ base: "center", sm: "flex-start" }}
            >
              Logout
            </Button>
          </Stack>
        </VStack>
      </Box>
    );
  }

  // 3. Unauthenticated State: Show Login Form
  return (
    <Box w="100%">
      <LoginForm />
    </Box>
  );
};
