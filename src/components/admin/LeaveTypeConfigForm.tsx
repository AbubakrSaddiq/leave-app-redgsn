// ============================================
// Leave Type Configuration Form
// ============================================

import React, { useEffect } from "react";
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
  Textarea,
  VStack,
  HStack,
  Switch,
  Text,
  FormErrorMessage,
  useBreakpointValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  LeaveType,
  LeaveTypeConfigFormData,
  LEAVE_TYPE_LABELS,
  LEAVE_TYPE_DESCRIPTIONS,
  DEFAULT_LEAVE_CONFIG,
} from "@/types/leaveType";
import {
  spacing,
  fontSizes,
  componentSizes,
  componentResponsive,
  useIsMobile,
} from "@/styles/responsive";

interface LeaveTypeConfigFormProps {
  leaveType?: LeaveType | null;
  existingConfig?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: LeaveTypeConfigFormData) => Promise<void>;
}

export const LeaveTypeConfigForm: React.FC<LeaveTypeConfigFormProps> = ({
  leaveType,
  existingConfig,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const isEditing = !!existingConfig;
  const isMobile = useIsMobile();
  const modalSize = useBreakpointValue(componentResponsive.modal.size);
  const formLabelSize = useBreakpointValue({ base: "xs", md: "sm" });
  const inputSize = useBreakpointValue(componentSizes.inputs.md);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeaveTypeConfigFormData>({
    defaultValues: {
      leave_type: leaveType || "annual",
      annual_days:
        existingConfig?.annual_days || DEFAULT_LEAVE_CONFIG.annual_days,
      min_notice_days:
        existingConfig?.min_notice_days || DEFAULT_LEAVE_CONFIG.min_notice_days,
      can_reapply:
        existingConfig?.can_reapply || DEFAULT_LEAVE_CONFIG.can_reapply,
      description:
        existingConfig?.description ||
        LEAVE_TYPE_DESCRIPTIONS[leaveType || "annual"],
    },
  });

  const canReapply = watch("can_reapply");

  useEffect(() => {
    if (isOpen) {
      if (existingConfig) {
        reset({
          leave_type: existingConfig.leave_type,
          annual_days: existingConfig.annual_days,
          min_notice_days: existingConfig.min_notice_days,
          can_reapply: existingConfig.can_reapply,
          description:
            existingConfig.description ||
            LEAVE_TYPE_DESCRIPTIONS[existingConfig.leave_type],
        });
      } else if (leaveType) {
        reset({
          leave_type: leaveType,
          annual_days: DEFAULT_LEAVE_CONFIG.annual_days,
          min_notice_days: DEFAULT_LEAVE_CONFIG.min_notice_days,
          can_reapply: DEFAULT_LEAVE_CONFIG.can_reapply,
          description: LEAVE_TYPE_DESCRIPTIONS[leaveType],
        });
      }
    }
  }, [isOpen, existingConfig, leaveType, reset]);

  const onSubmit = async (data: LeaveTypeConfigFormData) => {
    await onSuccess(data);
    onClose();
    reset();
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            borderBottomWidth="1px"
            fontSize={fontSizes.headings.card}
          >
            {isEditing
              ? "Edit Leave Configuration"
              : `Configure ${LEAVE_TYPE_LABELS[leaveType!]}`}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody py={spacing.stackSpacing.lg}>
            <VStack spacing={spacing.stackSpacing.md}>
              {/* Leave Type (read-only in edit mode) */}
              <FormControl isRequired>
                <FormLabel fontSize={formLabelSize} fontWeight="bold">
                  Leave Type
                </FormLabel>
                <Input
                  value={
                    LEAVE_TYPE_LABELS[existingConfig?.leave_type || leaveType!]
                  }
                  isDisabled={true}
                  bg="gray.50"
                  size={inputSize}
                />
                {!isEditing && (
                  <Text
                    fontSize={fontSizes.body.caption}
                    color="gray.500"
                    mt={1}
                  >
                    {LEAVE_TYPE_DESCRIPTIONS[leaveType!]}
                  </Text>
                )}
              </FormControl>

              {/* Annual Days */}
              <FormControl isRequired isInvalid={!!errors.annual_days}>
                <FormLabel fontSize={formLabelSize} fontWeight="bold">
                  Annual Allocation (days)
                </FormLabel>
                <NumberInput
                  min={0}
                  max={365}
                  defaultValue={existingConfig?.annual_days || 0}
                  onChange={(value) =>
                    setValue("annual_days", parseInt(value) || 0)
                  }
                >
                  <NumberInputField
                    {...register("annual_days", {
                      required: "Annual days is required",
                      min: { value: 0, message: "Must be at least 0" },
                      max: { value: 365, message: "Cannot exceed 365" },
                      valueAsNumber: true,
                    })}
                    size={inputSize}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage fontSize={fontSizes.body.small}>
                  {errors.annual_days?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Minimum Notice Days */}
              <FormControl isInvalid={!!errors.min_notice_days}>
                <FormLabel fontSize={formLabelSize} fontWeight="bold">
                  Minimum Notice Period (days)
                </FormLabel>
                <NumberInput
                  min={0}
                  max={90}
                  defaultValue={existingConfig?.min_notice_days || 0}
                  onChange={(value) =>
                    setValue("min_notice_days", parseInt(value) || 0)
                  }
                >
                  <NumberInputField
                    {...register("min_notice_days", {
                      required: "Notice period is required",
                      min: { value: 0, message: "Must be at least 0" },
                      max: { value: 90, message: "Cannot exceed 90 days" },
                      valueAsNumber: true,
                    })}
                    size={inputSize}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize={fontSizes.body.caption} color="gray.500" mt={1}>
                  Days in advance staff must submit request
                </Text>
                <FormErrorMessage fontSize={fontSizes.body.small}>
                  {errors.min_notice_days?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Can Reapply */}
              <FormControl>
                <HStack justify="space-between" width="100%">
                  <FormLabel fontSize={formLabelSize} fontWeight="bold" mb={0}>
                    Allow Reapplication
                  </FormLabel>
                  <Switch
                    isChecked={canReapply}
                    onChange={(e) => setValue("can_reapply", e.target.checked)}
                    colorScheme="green"
                    size="lg"
                  />
                </HStack>
                <Text fontSize={fontSizes.body.caption} color="gray.500" mt={1}>
                  Allow staff to reapply for this leave type within the same
                  year
                </Text>
              </FormControl>

              {/* Description */}
              <FormControl>
                <FormLabel fontSize={formLabelSize} fontWeight="bold">
                  Description
                </FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Describe the leave type, eligibility criteria, and any special conditions..."
                  rows={4}
                  size={inputSize}
                  fontSize={fontSizes.body.small}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter
            bg="gray.50"
            borderBottomRadius="xl"
            gap={spacing.gaps.md}
          >
            <Button
              variant="ghost"
              onClick={onClose}
              size={inputSize}
              width={{ base: "100%", sm: "auto" }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
              size={inputSize}
              width={{ base: "100%", sm: "auto" }}
            >
              {isEditing ? "Save Changes" : "Create Configuration"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
