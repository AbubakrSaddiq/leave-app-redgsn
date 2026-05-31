// File: src/components/admin/UserForm.tsx (REFACTORED)
// ============================================
// User Form Component - Mobile Responsive
// Integrated with existing password management
// ============================================

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
  Text,
  Box,
  HStack,
  RadioGroup,
  Radio,
  Stack,
  InputRightElement,
  IconButton,
  Tooltip,
  Badge,
  Spinner,
  Center,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiBriefcase,
  FiAward,
  FiRefreshCw,
  FiCopy,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { getDesignations } from "@/api/designation.api";
import { useCreateUser, useUpdateUser } from "@/hooks/useUserMutations";
import {
  spacing,
  fontSizes,
  componentSizes,
  componentResponsive,
  useIsMobile,
} from "@/styles/responsive";
import type { User, Department, Designation } from "@/types/user";

// Constants
const DEFAULT_PASSWORD = "Naseni123!";

// Password generation utility
const generateSecurePassword = (): string => {
  const length = 12;
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

interface UserFormProps {
  user?: User | null;
  departments: Department[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  departments,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isMobile = useIsMobile();
  const modalSize = useBreakpointValue(componentResponsive.modal.size);
  const formLabelSize = useBreakpointValue({ base: "xs", md: "sm" });
  const inputSize = useBreakpointValue(componentSizes.inputs.md);
  const buttonSize = useBreakpointValue(componentSizes.buttons.md);

  const [passwordOption, setPasswordOption] = useState<"default" | "auto">(
    "default",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: DEFAULT_PASSWORD,
    role: "staff",
    department_id: "",
    designation_id: "",
  });

  // Fetch designations
  const { data: designations, isLoading: loadingDesignations } = useQuery({
    queryKey: ["designations"],
    queryFn: getDesignations,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && !user) {
      // Create mode
      setPasswordOption("default");
      setFormData({
        email: "",
        full_name: "",
        password: DEFAULT_PASSWORD,
        role: "staff",
        department_id: "",
        designation_id: "",
      });
      setShowPassword(false);
    } else if (isOpen && user) {
      // Edit mode - populate with user data
      setFormData({
        email: user.email || "",
        full_name: user.full_name || "",
        password: "",
        role: user.role || "staff",
        department_id: user.department_id || "",
        designation_id: user.designation_id || "",
      });
    }
  }, [isOpen, user]);

  // Update password when option changes (create mode only)
  useEffect(() => {
    if (!user) {
      if (passwordOption === "default") {
        setFormData((prev) => ({ ...prev, password: DEFAULT_PASSWORD }));
      } else {
        setFormData((prev) => ({
          ...prev,
          password: generateSecurePassword(),
        }));
      }
    }
  }, [passwordOption, user]);

  const handleRegeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setFormData((prev) => ({ ...prev, password: newPassword }));
    toast({
      title: "Password regenerated",
      description: "A new secure password has been generated",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: isMobile ? "top" : "bottom-right",
    });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    toast({
      title: "Password copied to clipboard",
      description: "Make sure to share it securely with the user",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: isMobile ? "top" : "bottom-right",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      // UPDATE MODE
      try {
        await updateUserMutation.mutateAsync({
          id: user.id,
          data: {
            full_name: formData.full_name,
            role: formData.role as User["role"],
            department_id: formData.department_id || null,
            designation_id: formData.designation_id || null,
          },
        });

        toast({
          title: "User updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: isMobile ? "top" : "bottom-right",
        });

        onSuccess();
        onClose();
      } catch (error: any) {
        toast({
          title: "Update failed",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: isMobile ? "top" : "bottom-right",
        });
      }
    } else {
      // CREATE MODE
      try {
        await createUserMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role as User["role"],
          department_id: formData.department_id || null,
          designation_id: formData.designation_id || null,
        });

        toast({
          title: "User created successfully",
          description:
            passwordOption === "auto"
              ? "Generated password has been copied to clipboard"
              : `Default password: ${DEFAULT_PASSWORD}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: isMobile ? "top" : "bottom-right",
        });

        // Auto-copy password for convenience
        if (passwordOption === "auto") {
          await navigator.clipboard.writeText(formData.password);
        }

        onSuccess();
        onClose();
      } catch (error: any) {
        toast({
          title: "Creation failed",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: isMobile ? "top" : "bottom-right",
        });
      }
    }
  };

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={modalSize}
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius={isMobile ? 0 : "xl"}
        mx={isMobile ? 0 : 4}
        my={isMobile ? 0 : "auto"}
        minH={isMobile ? "100vh" : "auto"}
      >
        <form onSubmit={handleSubmit}>
          <ModalHeader
            borderBottomWidth="1px"
            fontSize={fontSizes.headings.card}
            py={spacing.gaps.md}
          >
            {user ? "Edit Staff Member" : "Register New Staff"}
          </ModalHeader>
          <ModalCloseButton top={spacing.gaps.md} right={spacing.gaps.md} />

          <ModalBody py={spacing.stackSpacing.lg}>
            <VStack spacing={spacing.stackSpacing.md}>
              {/* Email Field - Disabled in edit mode */}
              <FormControl isRequired isDisabled={!!user}>
                <FormLabel fontSize={formLabelSize} fontWeight="bold">
                  Email Address
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon
                      as={FiMail}
                      color="gray.400"
                      boxSize={componentSizes.icons.sm}
                    />
                  </InputLeftElement>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@naseni.gov.ng"
                    size={inputSize}
                    fontSize={fontSizes.body.medium}
                  />
                </InputGroup>
              </FormControl>

              {/* Password Section - Create mode only */}
              {!user && (
                <>
                  {/* Password Option Radio */}
                  <FormControl isRequired>
                    <FormLabel fontSize={formLabelSize} fontWeight="bold">
                      Password Option
                    </FormLabel>
                    <RadioGroup
                      value={passwordOption}
                      onChange={(val) =>
                        setPasswordOption(val as "default" | "auto")
                      }
                    >
                      <Stack
                        direction={{ base: "column", sm: "row" }}
                        spacing={{ base: 3, sm: 6 }}
                      >
                        <Radio value="default" colorScheme="blue">
                          <HStack spacing={2}>
                            <Text fontSize={fontSizes.body.small}>
                              Default Password
                            </Text>
                            <Badge
                              colorScheme="blue"
                              fontSize={fontSizes.badge}
                              px={spacing.gaps.xs}
                            >
                              Naseni123!
                            </Badge>
                          </HStack>
                        </Radio>
                        <Radio value="auto" colorScheme="green">
                          <HStack spacing={2}>
                            <Text fontSize={fontSizes.body.small}>
                              Auto-Generate
                            </Text>
                            <Badge
                              colorScheme="green"
                              fontSize={fontSizes.badge}
                              px={spacing.gaps.xs}
                            >
                              Secure
                            </Badge>
                          </HStack>
                        </Radio>
                      </Stack>
                    </RadioGroup>
                    <Text
                      fontSize={fontSizes.body.caption}
                      color="gray.500"
                      mt={spacing.gaps.xs}
                    >
                      {passwordOption === "default"
                        ? "Uses the standard temporary password for new users"
                        : "Generates a strong random password (12+ characters)"}
                    </Text>
                  </FormControl>

                  {/* Password Display Field */}
                  <FormControl isRequired>
                    <FormLabel fontSize={formLabelSize} fontWeight="bold">
                      {passwordOption === "default"
                        ? "Default Password"
                        : "Generated Password"}
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon
                          as={FiLock}
                          color="gray.400"
                          boxSize={componentSizes.icons.sm}
                        />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        readOnly
                        bg="gray.50"
                        fontFamily="mono"
                        fontSize={fontSizes.body.small}
                        size={inputSize}
                      />
                      <InputRightElement width="auto" pr={2}>
                        <HStack spacing={1}>
                          {passwordOption === "auto" && (
                            <Tooltip label="Regenerate password">
                              <IconButton
                                aria-label="Regenerate password"
                                icon={<FiRefreshCw />}
                                size="xs"
                                variant="ghost"
                                onClick={handleRegeneratePassword}
                              />
                            </Tooltip>
                          )}
                          <Tooltip label="Copy password">
                            <IconButton
                              aria-label="Copy password"
                              icon={<FiCopy />}
                              size="xs"
                              variant="ghost"
                              onClick={handleCopyPassword}
                            />
                          </Tooltip>
                          <Tooltip
                            label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            <IconButton
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              icon={showPassword ? <FiEyeOff /> : <FiEye />}
                              size="xs"
                              variant="ghost"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          </Tooltip>
                        </HStack>
                      </InputRightElement>
                    </InputGroup>
                    <Text
                      fontSize={fontSizes.body.caption}
                      color="orange.600"
                      mt={spacing.gaps.xs}
                      fontWeight="medium"
                    >
                      ⚠️ Password will be copied to clipboard on user creation
                    </Text>
                  </FormControl>
                </>
              )}

              {/* Full Name Field */}
              <FormControl isRequired>
                <FormLabel fontSize={formLabelSize} fontWeight="bold">
                  Full Name
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon
                      as={FiUser}
                      color="gray.400"
                      boxSize={componentSizes.icons.sm}
                    />
                  </InputLeftElement>
                  <Input
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="e.g., Jane Doe"
                    size={inputSize}
                    fontSize={fontSizes.body.medium}
                  />
                </InputGroup>
              </FormControl>

              {/* Role and Department Row - Responsive */}
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={spacing.stackSpacing.md}
                width="100%"
              >
                <FormControl isRequired>
                  <FormLabel fontSize={formLabelSize} fontWeight="bold">
                    Access Role
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon
                        as={FiShield}
                        color="gray.400"
                        boxSize={componentSizes.icons.sm}
                      />
                    </InputLeftElement>
                    <Select
                      pl="40px"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      size={inputSize}
                    >
                      <option value="staff">Staff</option>
                      <option value="director">Director</option>
                      <option value="hr">HR Admin</option>
                      <option value="admin">System Admin</option>
                    </Select>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={formLabelSize} fontWeight="bold">
                    Department
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon
                        as={FiBriefcase}
                        color="gray.400"
                        boxSize={componentSizes.icons.sm}
                      />
                    </InputLeftElement>
                    <Select
                      pl="40px"
                      value={formData.department_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          department_id: e.target.value,
                        })
                      }
                      placeholder="Unassigned"
                      size={inputSize}
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.code} - {d.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </FormControl>
              </Stack>

              {/* Designation Field */}
              <FormControl>
                <FormLabel fontSize={formLabelSize} fontWeight="bold">
                  Designation
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon
                      as={FiAward}
                      color="gray.400"
                      boxSize={componentSizes.icons.sm}
                    />
                  </InputLeftElement>
                  <Select
                    pl="40px"
                    value={formData.designation_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        designation_id: e.target.value,
                      })
                    }
                    placeholder="Select designation"
                    isDisabled={loadingDesignations}
                    size={inputSize}
                  >
                    {designations?.map((d: Designation) => (
                      <option key={d.id} value={d.id}>
                        {d.name} {d.code && `(${d.code})`}
                      </option>
                    ))}
                  </Select>
                </InputGroup>

                {/* Loading state for designations */}
                {loadingDesignations && (
                  <HStack mt={spacing.gaps.xs} spacing={spacing.gaps.sm}>
                    <Spinner size="xs" color="gray.400" />
                    <Text fontSize={fontSizes.body.caption} color="gray.500">
                      Loading designations...
                    </Text>
                  </HStack>
                )}

                <Text
                  fontSize={fontSizes.body.caption}
                  color="gray.500"
                  mt={spacing.gaps.xs}
                >
                  Job title/position (e.g., Director, Manager, Officer)
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter
            bg="gray.50"
            borderBottomRadius="xl"
            gap={spacing.gaps.md}
            flexDirection={{ base: "column", sm: "row" }}
          >
            <Button
              variant="ghost"
              onClick={onClose}
              size={buttonSize}
              width={{ base: "100%", sm: "auto" }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              size={buttonSize}
              width={{ base: "100%", sm: "auto" }}
            >
              {user ? "Save Changes" : "Create Account"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
