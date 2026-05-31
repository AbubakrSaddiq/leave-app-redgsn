// ============================================
// Profile Page Component - Fully Responsive

// ============================================

import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Badge,
  Divider,
  Icon,
  Spinner,
  Center,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiShield,
  FiMail,
  FiBriefcase,
  FiCalendar,
  FiEdit,
  FiSave,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile } from "@/hooks/useProfile";
import { ChangePasswordForm } from "./ChangePasswordForm";
import {
  spacing,
  fontSizes,
  componentSizes,
  layoutDirections,
  componentResponsive,
  useIsMobile,
  useIsDesktop,
} from "@/styles/responsive";

export const ProfilePage: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      full_name: profile?.full_name || "",
    },
  });

  // Responsive hooks
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();

  // Update form when profile loads
  React.useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateProfileMutation.mutateAsync({
        full_name: data.full_name,
      });
      await refreshProfile();
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: isMobile ? "top" : "bottom-right",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: isMobile ? "top" : "bottom-right",
      });
    }
  };

  const onCancel = () => {
    reset({
      full_name: profile?.full_name || "",
    });
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <Center minH={{ base: "300px", md: "400px" }} py={spacing.section.base}>
        <VStack spacing={spacing.stackSpacing.sm}>
          <Spinner
            size={isMobile ? "lg" : "xl"}
            color="blue.500"
            thickness="4px"
          />
          <Text fontSize={fontSizes.body.medium} color="gray.600">
            Loading profile...
          </Text>
        </VStack>
      </Center>
    );
  }

  // Get role badge color scheme
  const getRoleColorScheme = () => {
    switch (profile.role) {
      case "admin":
        return "purple";
      case "hr":
        return "blue";
      case "director":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <Container
      maxW="container.lg"
      py={spacing.container}
      px={spacing.container}
    >
      <VStack spacing={spacing.stackSpacing.lg} align="stretch">
        {/* Header Section */}
        <Box>
          <Heading fontSize={fontSizes.headings.pageTitle} mb={spacing.gaps.sm}>
            My Profile
          </Heading>
          <Text fontSize={fontSizes.body.medium} color="gray.600">
            Manage your account settings and preferences
          </Text>
        </Box>

        {/* Tabs Section */}
        <Tabs
          colorScheme="blue"
          variant="enclosed"
          isLazy
          size={isMobile ? "sm" : "md"}
        >
          {/* Responsive TabList */}
          <TabList
            overflowX={componentResponsive.profilePage.tabListOverflow}
            overflowY="hidden"
            whiteSpace="nowrap"
            css={{
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                height: "4px",
              },
            }}
          >
            <Tab>
              <Icon as={FiUser} mr={spacing.gaps.xs} />
              <Text as="span" display={{ base: "none", sm: "inline" }}>
                General
              </Text>
            </Tab>
            <Tab>
              <Icon as={FiShield} mr={spacing.gaps.xs} />
              <Text as="span" display={{ base: "none", xs: "inline" }}>
                Security
              </Text>
            </Tab>
          </TabList>

          <TabPanels>
            {/* GENERAL TAB */}
            <TabPanel p={spacing.card} pt={spacing.gaps.lg}>
              <Card variant="elevated">
                <CardBody p={spacing.card}>
                  <VStack spacing={spacing.stackSpacing.xl} align="stretch">
                    {/* Profile Information Form */}
                    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                      <VStack spacing={spacing.stackSpacing.lg} align="stretch">
                        {/* Header with Edit/Save/Cancel Buttons */}
                        <Stack
                          direction={layoutDirections.stack.mobileVertical}
                          justify="space-between"
                          align={{ base: "flex-start", sm: "center" }}
                          spacing={spacing.stackSpacing.sm}
                        >
                          <Heading
                            size={isMobile ? "sm" : "md"}
                            fontSize={fontSizes.headings.card}
                          >
                            Profile Information
                          </Heading>

                          {/* Action Buttons */}
                          {!isEditing ? (
                            <Button
                              size={componentSizes.buttons.md}
                              leftIcon={<FiEdit />}
                              onClick={() => setIsEditing(true)}
                              colorScheme="blue"
                              variant="outline"
                              width={{ base: "100%", sm: "auto" }}
                            >
                              Edit Profile
                            </Button>
                          ) : (
                            <HStack
                              spacing={spacing.gaps.md}
                              width={{ base: "100%", sm: "auto" }}
                            >
                              <Button
                                size={componentSizes.buttons.md}
                                leftIcon={<FiX />}
                                onClick={onCancel}
                                variant="ghost"
                                width={{ base: "50%", sm: "auto" }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size={componentSizes.buttons.md}
                                leftIcon={<FiSave />}
                                type="submit"
                                colorScheme="blue"
                                isLoading={updateProfileMutation.isPending}
                                width={{ base: "50%", sm: "auto" }}
                              >
                                Save Changes
                              </Button>
                            </HStack>
                          )}
                        </Stack>

                        <Divider />

                        {/* Full Name Field */}
                        <FormControl isInvalid={!!errors.full_name}>
                          <FormLabel fontSize={fontSizes.body.small}>
                            Full Name
                          </FormLabel>
                          {isEditing ? (
                            <Input
                              {...register("full_name", {
                                required: "Name is required",
                                minLength: {
                                  value: 2,
                                  message: "Name must be at least 2 characters",
                                },
                              })}
                              size={componentSizes.inputs.md}
                              fontSize={fontSizes.body.medium}
                              autoFocus
                            />
                          ) : (
                            <HStack
                              spacing={spacing.gaps.md}
                              align="center"
                              flexWrap="wrap"
                            >
                              <Icon
                                as={FiUser}
                                color="gray.400"
                                boxSize={componentSizes.icons.md}
                              />
                              <Text
                                fontSize={fontSizes.body.large}
                                fontWeight="medium"
                                wordBreak="break-word"
                              >
                                {profile.full_name}
                              </Text>
                            </HStack>
                          )}
                          <FormErrorMessage fontSize={fontSizes.body.small}>
                            {errors.full_name?.message}
                          </FormErrorMessage>
                        </FormControl>

                        {/* Email Field */}
                        <FormControl>
                          <FormLabel fontSize={fontSizes.body.small}>
                            Email Address
                          </FormLabel>
                          <Stack
                            direction={{ base: "column", xs: "row" }}
                            spacing={spacing.gaps.md}
                            align={{ base: "flex-start", xs: "center" }}
                            wrap="wrap"
                          >
                            <HStack spacing={spacing.gaps.sm}>
                              <Icon
                                as={FiMail}
                                color="gray.400"
                                boxSize={componentSizes.icons.md}
                              />
                              <Text
                                fontSize={fontSizes.body.medium}
                                color="gray.700"
                                wordBreak="break-all"
                              >
                                {profile.email}
                              </Text>
                            </HStack>
                            <Badge
                              colorScheme="gray"
                              fontSize={fontSizes.badge}
                              px={spacing.gaps.xs}
                              py={0.5}
                              whiteSpace="nowrap"
                              borderRadius="full"
                            >
                              Cannot be changed
                            </Badge>
                          </Stack>
                        </FormControl>

                        {/* Role Field */}
                        <FormControl>
                          <FormLabel fontSize={fontSizes.body.small}>
                            Role
                          </FormLabel>
                          <HStack
                            spacing={spacing.gaps.md}
                            align="center"
                            flexWrap="wrap"
                          >
                            <Icon
                              as={FiShield}
                              color="gray.400"
                              boxSize={componentSizes.icons.md}
                            />
                            <Badge
                              colorScheme={getRoleColorScheme()}
                              fontSize={fontSizes.body.small}
                              px={spacing.gaps.md}
                              py={spacing.gaps.xs}
                              borderRadius="full"
                              textTransform="capitalize"
                            >
                              {profile.role}
                            </Badge>
                          </HStack>
                        </FormControl>

                        {/* Department Field */}
                        {profile.department && (
                          <FormControl>
                            <FormLabel fontSize={fontSizes.body.small}>
                              Department
                            </FormLabel>
                            <Stack
                              direction={{ base: "column", xs: "row" }}
                              spacing={spacing.gaps.md}
                              align={{ base: "flex-start", xs: "center" }}
                              wrap="wrap"
                            >
                              <HStack spacing={spacing.gaps.sm}>
                                <Icon
                                  as={FiBriefcase}
                                  color="gray.400"
                                  boxSize={componentSizes.icons.md}
                                />
                                <Text
                                  fontSize={fontSizes.body.medium}
                                  fontWeight="medium"
                                  wordBreak="break-word"
                                >
                                  {profile.department.name}
                                </Text>
                              </HStack>
                              {profile.department.code && (
                                <Badge
                                  colorScheme="gray"
                                  variant="outline"
                                  fontSize={fontSizes.badge}
                                  px={spacing.gaps.xs}
                                >
                                  {profile.department.code}
                                </Badge>
                              )}
                            </Stack>
                          </FormControl>
                        )}

                        {/* Last Login Field (if available) */}
                        {(profile as any).last_login && (
                          <FormControl>
                            <FormLabel fontSize={fontSizes.body.small}>
                              Last Login
                            </FormLabel>
                            <HStack spacing={spacing.gaps.md}>
                              <Icon
                                as={FiCalendar}
                                color="gray.400"
                                boxSize={componentSizes.icons.md}
                              />
                              <Text
                                fontSize={fontSizes.body.medium}
                                color="gray.600"
                              >
                                {new Date(
                                  (profile as any).last_login,
                                ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </Text>
                            </HStack>
                          </FormControl>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* SECURITY TAB */}
            <TabPanel p={spacing.card} pt={spacing.gaps.lg}>
              <ChangePasswordForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default ProfilePage;
