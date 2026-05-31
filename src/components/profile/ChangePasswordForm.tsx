// ============================================
// Change Password Form Component - Fully Responsive

// ============================================

import React, { useState } from "react";
import {
  Card,
  CardBody,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
  Box,
  Divider,
  Text,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FiLock, FiCheck, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { useChangePassword } from "@/hooks/useProfile";
import {
  spacing,
  fontSizes,
  componentSizes,
  layoutDirections,
  useIsMobile,
} from "@/styles/responsive";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordForm: React.FC = () => {
  const [showPasswords, setShowPasswords] = useState(false);
  const toast = useToast();
  const changePasswordMutation = useChangePassword();
  const isMobile = useIsMobile();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: isMobile ? "top" : "bottom-right",
      });

      reset();
    } catch (error: any) {
      toast({
        title: "Password change failed",
        description: error.message || "Please check your current password",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: isMobile ? "top" : "bottom-right",
      });
    }
  };

  return (
    <Card variant="elevated">
      <CardBody p={spacing.card}>
        <VStack spacing={spacing.stackSpacing.lg} align="stretch">
          {/* Header */}
          <Heading
            size={isMobile ? "sm" : "md"}
            fontSize={fontSizes.headings.card}
          >
            Change Password
          </Heading>

          <Divider />

          {/* Description */}
          <Text fontSize={fontSizes.body.small} color="gray.600">
            For your security, please choose a strong password that you haven't
            used before.
          </Text>

          {/* Info Alert */}
          <Alert
            status="info"
            borderRadius="md"
            flexDirection={layoutDirections.stack.mobileVertical}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <AlertIcon />
            <AlertDescription fontSize={fontSizes.body.small}>
              Password must be at least 8 characters long
            </AlertDescription>
          </Alert>

          {/* Form */}
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={spacing.stackSpacing.lg} align="stretch">
              {/* Current Password */}
              <FormControl isInvalid={!!errors.currentPassword}>
                <FormLabel fontSize={fontSizes.body.small}>
                  Current Password
                </FormLabel>
                <Input
                  type={showPasswords ? "text" : "password"}
                  size={componentSizes.inputs.md}
                  fontSize={fontSizes.body.medium}
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />
                <FormErrorMessage fontSize={fontSizes.body.small}>
                  {errors.currentPassword?.message}
                </FormErrorMessage>
              </FormControl>

              {/* New Password */}
              <FormControl isInvalid={!!errors.newPassword}>
                <FormLabel fontSize={fontSizes.body.small}>
                  New Password
                </FormLabel>
                <Input
                  type={showPasswords ? "text" : "password"}
                  size={componentSizes.inputs.md}
                  fontSize={fontSizes.body.medium}
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
                <FormErrorMessage fontSize={fontSizes.body.small}>
                  {errors.newPassword?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Confirm Password */}
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel fontSize={fontSizes.body.small}>
                  Confirm New Password
                </FormLabel>
                <Input
                  type={showPasswords ? "text" : "password"}
                  size={componentSizes.inputs.md}
                  fontSize={fontSizes.body.medium}
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                />
                <FormErrorMessage fontSize={fontSizes.body.small}>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Show/Hide Password Toggle */}
              <Button
                size={componentSizes.buttons.sm}
                variant="ghost"
                onClick={() => setShowPasswords(!showPasswords)}
                alignSelf="flex-start"
                leftIcon={showPasswords ? <FiEyeOff /> : <FiEye />}
                rightIcon={showPasswords ? undefined : <FiLock />}
              >
                {showPasswords ? "Hide Passwords" : "Show Passwords"}
              </Button>

              <Divider />

              {/* Action Buttons */}
              <Stack
                direction={layoutDirections.stack.mobileVertical}
                spacing={spacing.stackSpacing.sm}
                justify="flex-end"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => reset()}
                  size={componentSizes.buttons.md}
                  width={{ base: "100%", sm: "auto" }}
                  leftIcon={<FiX />}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={changePasswordMutation.isPending}
                  leftIcon={<FiCheck />}
                  size={componentSizes.buttons.md}
                  width={{ base: "100%", sm: "auto" }}
                >
                  Update Password
                </Button>
              </Stack>
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ChangePasswordForm;
