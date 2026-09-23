// src/components/auth/LoginForm.tsx
// ============================================
// Login Form - Light Mode
// ============================================

import React, { useState } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  useToast,
  Divider,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiLogIn } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      toast({
        title: "Login Successful",
        description: "Welcome back to the Leave Management System.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch" as="form" onSubmit={handleLogin}>
      {/* Header */}
      <VStack spacing={2} align="center">
        <Heading
          size="lg"
          color="naseni.primary"
          fontWeight="700"
          letterSpacing="-0.01em"
        >
          Welcome Back
        </Heading>
        <Text color="gray.500" fontSize="sm" textAlign="center">
          Sign in to continue
        </Text>
      </VStack>

      {/* Error Alert */}
      {error && (
        <Alert status="error" borderRadius="lg" fontSize="sm">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <FormControl isRequired>
        <FormLabel fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
          Email Address
        </FormLabel>
        <InputGroup size="lg">
          <Input
            type="email"
            placeholder="name@naseni.gov.ng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            fontSize="sm"
            _hover={{ borderColor: "gray.300" }}
            _focus={{
              borderColor: "naseni.secondary",
              bg: "white",
              boxShadow: "0 0 0 3px rgba(64,126,189,0.1)",
            }}
            _placeholder={{ color: "gray.400" }}
          />
        </InputGroup>
      </FormControl>

      {/* Password Field */}
      <FormControl isRequired>
        <FormLabel fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
          Password
        </FormLabel>
        <InputGroup size="lg">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            fontSize="sm"
            _hover={{ borderColor: "gray.300" }}
            _focus={{
              borderColor: "naseni.secondary",
              bg: "white",
              boxShadow: "0 0 0 3px rgba(64,126,189,0.1)",
            }}
            _placeholder={{ color: "gray.400" }}
          />
          <InputRightElement h="full">
            <IconButton
              variant="ghost"
              size="sm"
              icon={showPassword ? <FiEyeOff /> : <FiEye />}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              color="gray.400"
              _hover={{ color: "gray.600", bg: "transparent" }}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        fontSize="sm"
        fontWeight="600"
        bg="naseni.primary"
        color="white"
        borderRadius="lg"
        h="48px"
        isLoading={isLoading}
        loadingText="Signing in..."
        leftIcon={<FiLogIn />}
        _hover={{
          bg: "#002952",
          transform: "translateY(-1px)",
          boxShadow: "0 8px 20px rgba(0,51,102,0.2)",
        }}
        _active={{
          bg: "#001f3d",
          transform: "translateY(0)",
        }}
        transition="all 0.2s ease"
      >
        Sign In
      </Button>

      {/* Divider */}
      <HStack>
        <Divider borderColor="gray.200" />
        <Icon as={FiLock} color="gray.400" boxSize={3} />

        <Text fontSize="xs" color="gray.400" whiteSpace="nowrap" px={2}>
          Authorized Access Only
        </Text>
        <Divider borderColor="gray.200" />
      </HStack>
    </VStack>
  );
};

export default LoginForm;
