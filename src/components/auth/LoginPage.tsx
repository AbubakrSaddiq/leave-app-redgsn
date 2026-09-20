// src/components/auth/LoginPage.tsx

import React from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Image,
  Icon,
  useBreakpointValue,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { FiShield, FiUsers, FiCalendar } from "react-icons/fi";
import { LoginForm } from "./LoginForm";
import { spacing, fontSizes, useIsMobile } from "@/styles/responsive";

export const LoginPage: React.FC = () => {
  const isMobile = useIsMobile();
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" });
  const subtitleSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Flex
      minH="100vh"
      w="100%"
      bg="white"
      position="relative"
      overflow="hidden"
      align="center"
      justify="center"
    >
      {/* Decorative Background Elements */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        overflow="hidden"
        zIndex={0}
      >
        {/* Top right gradient blob */}
        <Box
          position="absolute"
          top="-20%"
          right="-10%"
          w={{ base: "300px", md: "500px", lg: "700px" }}
          h={{ base: "300px", md: "500px", lg: "700px" }}
          borderRadius="full"
          bg="radial-gradient(circle, rgba(0,51,102,0.06) 0%, transparent 70%)"
        />
        {/* Bottom left gradient blob */}
        <Box
          position="absolute"
          bottom="-20%"
          left="-10%"
          w={{ base: "300px", md: "500px", lg: "600px" }}
          h={{ base: "300px", md: "500px", lg: "600px" }}
          borderRadius="full"
          bg="radial-gradient(circle, rgba(64,126,189,0.05) 0%, transparent 70%)"
        />
        {/* Subtle grid pattern */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.4}
          backgroundImage="linear-gradient(rgba(0,51,102,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,51,102,0.03) 1px, transparent 1px)"
          backgroundSize="40px 40px"
        />
      </Box>

      {/* Main Content */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={{ base: 8, md: 12 }}
        position="relative"
        zIndex={1}
      >
        {/* Branding Header */}
        <VStack
          spacing={{ base: 4, md: 6 }}
          mb={{ base: 6, md: 10 }}
          textAlign="center"
        >
          {/* Logo */}
          <Box
            w={{ base: "64px", md: "80px" }}
            h={{ base: "64px", md: "80px" }}
            borderRadius="2xl"
            bg="white"
            boxShadow="0 4px 20px rgba(0,51,102,0.1)"
            border="1px solid"
            borderColor="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={3}
          >
            <Image
              src="/logo.png"
              alt="NASENI Logo"
              w="100%"
              h="100%"
              objectFit="contain"
            />
          </Box>

          {/* Portal Title */}
          <VStack spacing={1}>
            <Heading
              size={subtitleSize}
              color="naseni.primary"
              fontWeight="800"
              letterSpacing="-0.02em"
            >
              NASENI Leave Portal
            </Heading>
          </VStack>

          {/* Trust badges */}
          <HStack
            spacing={{ base: 3, md: 6 }}
            flexWrap="wrap"
            justify="center"
            pt={2}
          >
            <HStack spacing={1.5}>
              <Icon as={FiShield} color="naseni.secondary" boxSize={3.5} />
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Secure Access
              </Text>
            </HStack>
            <HStack spacing={1.5}>
              <Icon as={FiUsers} color="naseni.secondary" boxSize={3.5} />
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Role-based
              </Text>
            </HStack>
            <HStack spacing={1.5}>
              <Icon as={FiCalendar} color="naseni.secondary" boxSize={3.5} />
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Leave Management
              </Text>
            </HStack>
          </HStack>
        </VStack>

        {/* Login Form Card */}
        <Box
          w="100%"
          maxW={{ base: "100%", sm: "440px" }}
          bg="white"
          borderRadius="2xl"
          boxShadow="0 20px 60px rgba(0,51,102,0.08), 0 4px 12px rgba(0,51,102,0.04)"
          border="1px solid"
          borderColor="gray.100"
          p={{ base: 6, md: 8 }}
          position="relative"
          overflow="hidden"
        >
          {/* Top accent bar */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="4px"
            bgGradient="linear-gradient(90deg, #003366, #407ebd, #003366)"
          />

          <LoginForm />
        </Box>

        {/* Footer */}
        <VStack spacing={2} mt={{ base: 6, md: 8 }}>
          <Divider maxW="200px" borderColor="gray.200" />
          <Text fontSize="xs" color="gray.400" textAlign="center" pt={2}>
            © {new Date().getFullYear()} NASENI.
          </Text>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
