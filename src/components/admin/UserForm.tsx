// File: src/components/admin/UserForm.tsx
// ============================================
// User Form Component - Mobile Responsive
// Includes auto leave allocation on create
// Shows success view inside the same modal
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
  useBreakpointValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Avatar,
  SimpleGrid,
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
  FiCheckCircle,
  FiLayers,
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

// ============================================
// UserFormData
// ============================================
export interface UserFormData {
  full_name: string;
  role: User["role"];
  department_id: string | null;
  designation_id: string | null;
  email?: string;
  is_active?: boolean;
}

const DEFAULT_PASSWORD = "Naseni123!";

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

// ============================================
// PROPS
// ============================================
interface UserFormProps {
  user?: User | null;
  departments: Department[];
  designations?: Designation[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data?: UserFormData | User) => void;
}

type ModalView = "form" | "success";

export const UserForm: React.FC<UserFormProps> = ({
  user,
  departments,
  designations: propDesignations = [],
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

  // ── Success view state ──
  const [view, setView] = useState<ModalView>("form");
  const [createdUser, setCreatedUser] = useState<any>(null);
  const [allocationYear, setAllocationYear] = useState(
    new Date().getFullYear(),
  );
  const [allocationStatus, setAllocationStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  // Fetch designations
  const { data: fetchedDesignations, isLoading: loadingDesignations } =
    useQuery({
      queryKey: ["designations"],
      queryFn: getDesignations,
    });

  const availableDesignations =
    propDesignations.length > 0 ? propDesignations : fetchedDesignations || [];

  // Reset when modal opens
  useEffect(() => {
    if (isOpen && !user) {
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
      setView("form");
      setCreatedUser(null);
      setAllocationStatus("pending");
    } else if (isOpen && user) {
      setFormData({
        email: user.email || "",
        full_name: user.full_name || "",
        password: "",
        role: user.role || "staff",
        department_id: user.department_id || "",
        designation_id: (user as any).designation_id || "",
      });
      setView("form");
    }
  }, [isOpen, user]);

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
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    toast({
      title: "Password copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData: UserFormData = {
      full_name: formData.full_name,
      role: formData.role as User["role"],
      department_id: formData.department_id || null,
      designation_id: formData.designation_id || null,
    };

    // ══════════════════════════════════════
    // UPDATE MODE
    // ══════════════════════════════════════
    if (user) {
      try {
        await updateUserMutation.mutateAsync({
          id: user.id,
          data: userData,
        });
        toast({
          title: "User updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        if (typeof onSuccess === "function") onSuccess(userData as any);
        onClose();
      } catch (error: any) {
        toast({
          title: "Update failed",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      return;
    }

    // ══════════════════════════════════════
    // CREATE MODE
    // ══════════════════════════════════════
    try {
      // 1. Create user (edge function allocates leave internally)
      const response: any = await createUserMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role as User["role"],
        department_id: formData.department_id || null,
        designation_id: formData.designation_id || null,
      });

      console.log("Edge function response:", response);

      // 2. Read allocation status from the response
      const allocationOk = response?.allocation_status === "success";

      setAllocationStatus(allocationOk ? "success" : "failed");

      // 3. Show success view
      setCreatedUser({
        id: response?.id,
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role,
        department: response?.user?.department || null,
        designation: response?.user?.designation || null,
      });
      setView("success");

      // 4. Notify parent
      if (typeof onSuccess === "function") {
        onSuccess({
          ...userData,
          id: response?.id,
          email: formData.email,
          is_active: true,
        } as any);
      }

      toast({
        title: "User created successfully",
        description: allocationOk
          ? `Leave allocated for ${response?.allocation_year ?? allocationYear}`
          : `User created, but leave allocation failed. Allocate manually.`,
        status: allocationOk ? "success" : "warning",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("User creation failed:", error);
      toast({
        title: "Creation failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleFinish = () => {
    setView("form");
    setCreatedUser(null);
    onClose();
  };

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending;

  // ═════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════
  return (
    <Modal
      isOpen={isOpen}
      onClose={view === "success" ? handleFinish : onClose}
      isCentered
      size={modalSize}
      motionPreset="slideInBottom"
      closeOnOverlayClick={view !== "success"}
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius={isMobile ? 0 : "xl"}
        mx={isMobile ? 0 : 4}
        my={isMobile ? 0 : "auto"}
        minH={isMobile ? "100vh" : "auto"}
      >
        {/* SUCCESS VIEW                          */}

        {view === "success" && createdUser ? (
          <>
            <ModalHeader
              borderBottomWidth="1px"
              py={spacing.gaps.md}
              color={
                allocationStatus === "success" ? "green.600" : "orange.600"
              }
            >
              <HStack spacing={2}>
                <Icon
                  as={allocationStatus === "success" ? FiCheckCircle : FiLayers}
                  boxSize={5}
                />
                <Text>
                  {allocationStatus === "success"
                    ? "User Created & Leave Allocated"
                    : "User Created"}
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton top={spacing.gaps.md} right={spacing.gaps.md} />

            <ModalBody py={spacing.stackSpacing.lg}>
              <VStack spacing={spacing.stackSpacing.lg} align="stretch">
                {/* Status Alert */}
                {allocationStatus === "success" && (
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle fontSize="sm">All Set!</AlertTitle>
                      <AlertDescription fontSize="xs">
                        {createdUser.full_name} has been created and their leave
                        balances have been allocated for {allocationYear}.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                {allocationStatus === "failed" && (
                  <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle fontSize="sm">
                        Leave Allocation Failed
                      </AlertTitle>
                      <AlertDescription fontSize="xs">
                        The user was created, but leave allocation failed. You
                        can allocate manually in Leave Allocation Management.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}

                {/* User Details */}
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.100"
                >
                  <HStack spacing={4} align="flex-start">
                    <Avatar
                      size="md"
                      name={formData.full_name}
                      bg="blue.500"
                      color="white"
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="bold" fontSize="md">
                        {formData.full_name}
                      </Text>
                      <HStack spacing={1} color="gray.600">
                        <Icon as={FiMail} boxSize={3} />
                        <Text fontSize="xs">{formData.email}</Text>
                      </HStack>
                      <HStack spacing={2} flexWrap="wrap">
                        <Badge colorScheme="purple" fontSize="xs">
                          {formData.role}
                        </Badge>
                        {(createdUser as any)?.department?.code && (
                          <Badge colorScheme="blue" fontSize="xs">
                            {(createdUser as any).department.code}
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>

                  <Divider my={3} />

                  <SimpleGrid columns={2} spacing={3}>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="10px" color="gray.500" fontWeight="bold">
                        PASSWORD
                      </Text>
                      <Text fontSize="xs" fontFamily="mono">
                        {formData.password}
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="10px" color="gray.500" fontWeight="bold">
                        ALLOCATION YEAR
                      </Text>
                      <Text fontSize="xs" fontWeight="medium">
                        {allocationYear}
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </Box>

                {/* Warning to copy password */}
                {allocationStatus === "success" && (
                  <Alert status="info" borderRadius="md" variant="left-accent">
                    <AlertIcon />
                    <Text fontSize="xs">
                      ⚠️ Copy the password above before closing — it won't be
                      shown again.
                    </Text>
                  </Alert>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter
              bg="gray.50"
              borderBottomRadius="xl"
              gap={spacing.gaps.md}
              flexDirection={{ base: "column", sm: "row" }}
            >
              <Button
                variant="outline"
                leftIcon={<FiCopy />}
                onClick={() => {
                  navigator.clipboard.writeText(formData.password);
                  toast({
                    title: "Password copied",
                    status: "success",
                    duration: 2000,
                  });
                }}
                size={buttonSize}
                width={{ base: "100%", sm: "auto" }}
              >
                Copy Password
              </Button>
              <Button
                colorScheme="green"
                leftIcon={<FiCheckCircle />}
                onClick={handleFinish}
                size={buttonSize}
                width={{ base: "100%", sm: "auto" }}
              >
                Done
              </Button>
            </ModalFooter>
          </>
        ) : (
          /* ══════════════════════════════════════ */
          /* FORM VIEW                             */
          /* ══════════════════════════════════════ */
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
                {/* Full Name */}
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
                        setFormData({
                          ...formData,
                          full_name: e.target.value,
                        })
                      }
                      placeholder="e.g., Jane Doe"
                      size={inputSize}
                      fontSize={fontSizes.body.medium}
                    />
                  </InputGroup>
                </FormControl>

                {/* Email */}
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

                {/* Password Section */}
                {!user && (
                  <>
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
                    </FormControl>

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
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
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
                        Kindly copy password before user creation
                      </Text>
                    </FormControl>
                  </>
                )}

                {/* Role + Department */}
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
                          setFormData({
                            ...formData,
                            role: e.target.value,
                          })
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

                {/* Designation */}
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
                      {availableDesignations.map((d: Designation) => (
                        <option key={d.id} value={d.id}>
                          {d.name} {d.code && `(${d.code})`}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>

                  {loadingDesignations && (
                    <HStack mt={spacing.gaps.xs} spacing={spacing.gaps.sm}>
                      <Spinner size="xs" color="gray.400" />
                      <Text fontSize={fontSizes.body.caption} color="gray.500">
                        Loading designations...
                      </Text>
                    </HStack>
                  )}
                </FormControl>

                {/* Info: leave allocated automatically */}
                {!user && (
                  <Alert
                    status="info"
                    borderRadius="md"
                    variant="left-accent"
                    fontSize="xs"
                  >
                    <AlertIcon />
                    <Text>
                      Leave balances will be automatically allocated for{" "}
                      <strong>{new Date().getFullYear()}</strong> after the user
                      is created.
                    </Text>
                  </Alert>
                )}
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
                loadingText="Creating..."
                size={buttonSize}
                width={{ base: "100%", sm: "auto" }}
              >
                {user ? "Save Changes" : "Create Account"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserForm;
