// File: src/components/leaves/LeaveApplicationForm.tsx (REFACTORED)
// ============================================
// Leave Application Form - Mobile Responsive
// ============================================

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Textarea,
  VStack,
  HStack,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  Badge,
  Icon,
  Link,
  useDisclosure,
  useBreakpointValue,
  Stack,
  Card,
  CardBody,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCalendar,
  FiBook,
  FiClock,
  FiInfo,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useCreateLeaveApplication } from "@/hooks/useLeaveApplication";
import {
  LEAVE_TYPE_OPTIONS,
  STUDY_PROGRAMS,
  getFixedDuration,
} from "@/constants/leaveConstants";
import { formatDisplayDate } from "@/utils/dateUtils";
import { format, addYears, subDays, addDays, addWeeks } from "date-fns";
import { LeaveType } from "@/types/models";
import {
  useValidateLeaveDates,
  useMyDesiredMonths,
} from "@/hooks/useDesiredLeaveMonths";
import { useMyLeaveBalances } from "@/hooks/useLeaveBalance";
import { DesiredLeaveMonthsForm } from "@/components/desiredMonths/DesiredLeaveMonthsForm";
import { leaveService } from "@/services/leaveService";
import {
  spacing,
  fontSizes,
  componentSizes,
  useIsMobile,
} from "@/styles/responsive";

interface LeaveFormData {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  working_days: number;
  study_program?: "bsc" | "msc" | "phd";
}

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  // Responsive values
  const isMobile = useIsMobile();
  const isSmallScreen = useBreakpointValue({ base: true, sm: false });
  const formSize = useBreakpointValue({ base: "md", md: "lg" });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const summaryColumns = useBreakpointValue({ base: 1, sm: 2 });

  // Modal control for desired months form
  const {
    isOpen: isDesiredMonthsOpen,
    onOpen: onDesiredMonthsOpen,
    onClose: onDesiredMonthsClose,
  } = useDisclosure();

  // ── Get default start date (14 days from today) ─────────────────────────
  const getDefaultStartDate = () => {
    return format(addWeeks(new Date(), 2), "yyyy-MM-dd");
  };

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<LeaveFormData>({
    defaultValues: {
      leave_type: LeaveType.ANNUAL,
      start_date: getDefaultStartDate(),
      end_date: "",
      reason: "",
      working_days: 1,
      study_program: undefined,
    },
  });

  const [workingDays, setWorkingDays] = useState(1);
  const [calculatedEndDate, setCalculatedEndDate] = useState("");
  const [resumptionDate, setResumptionDate] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const createMutation = useCreateLeaveApplication();
  const { data: balanceData } = useMyLeaveBalances();
  const { data: desiredMonths, refetch: refetchDesiredMonths } =
    useMyDesiredMonths();

  const leaveType = watch("leave_type");
  const startDate = watch("start_date");
  const studyProgram = watch("study_program");

  const currentBalance = balanceData?.balances.find(
    (b) => b.leave_type === leaveType,
  );

  // ── Helper: check if leave type has a fixed duration ─────────────────────
  const isFixedDurationLeave =
    leaveType === LeaveType.STUDY ||
    leaveType === LeaveType.PATERNITY ||
    leaveType === LeaveType.MATERNITY;

  // ── RESET form when leave type changes ────────────────────────────────────
  useEffect(() => {
    setWorkingDays(1);
    setCalculatedEndDate("");
    setResumptionDate("");
    setValue("working_days", 1);
    setValue("end_date", "");
    setValue("start_date", getDefaultStartDate());

    if (leaveType !== LeaveType.STUDY) {
      setValue("study_program", undefined);
    }
  }, [leaveType, setValue]);

  // ── Calculate end date ────────────────────────────────────────────────────
  useEffect(() => {
    if (!startDate) return;

    const fixedDays = getFixedDuration(leaveType);

    // 1) STUDY LEAVE: program-based
    if (leaveType === LeaveType.STUDY) {
      if (studyProgram) {
        const program = STUDY_PROGRAMS.find((p) => p.value === studyProgram);
        if (program) {
          const start = new Date(startDate);
          const end = subDays(addYears(start, program.durationYears), 1);
          const endDateStr = format(end, "yyyy-MM-dd");

          setCalculatedEndDate(endDateStr);
          setValue("end_date", endDateStr);
          setValue("working_days", program.durationYears * 365);
          setWorkingDays(program.durationYears * 365);
          setResumptionDate(
            format(addYears(start, program.durationYears), "yyyy-MM-dd"),
          );
        }
      }
      return;
    }

    // 2) FIXED DURATION (Paternity / Maternity): use calendar days
    if (fixedDays !== null) {
      const start = new Date(startDate);
      const end = addDays(start, fixedDays - 1);
      const endDateStr = format(end, "yyyy-MM-dd");
      const resumptionStr = format(addDays(start, fixedDays), "yyyy-MM-dd");

      setCalculatedEndDate(endDateStr);
      setResumptionDate(resumptionStr);
      setValue("end_date", endDateStr);
      setValue("working_days", fixedDays);
      setWorkingDays(fixedDays);
      return;
    }

    // 3) OTHER LEAVES: use working days and the leave service
    if (workingDays <= 0) return;

    const updateDates = async () => {
      setIsCalculating(true);
      try {
        const endDate = await leaveService.calculateEndDate(
          startDate,
          workingDays,
        );
        const resumption = await leaveService.calculateResumptionDate(endDate);

        setCalculatedEndDate(endDate);
        setResumptionDate(resumption);
        setValue("end_date", endDate);
        setValue("working_days", workingDays);
      } finally {
        setIsCalculating(false);
      }
    };
    updateDates();
  }, [startDate, workingDays, leaveType, studyProgram, setValue]);

  // Validate annual leave against desired months
  const shouldValidateDesiredMonths =
    leaveType === LeaveType.ANNUAL &&
    !!startDate &&
    !!calculatedEndDate &&
    !isCalculating &&
    !!desiredMonths;

  const {
    data: desiredMonthsValidation,
    isLoading: isValidatingDesiredMonths,
  } = useValidateLeaveDates(
    startDate,
    calculatedEndDate,
    shouldValidateDesiredMonths,
  );

  const isAnnualLeaveBlocked = leaveType === LeaveType.ANNUAL && !desiredMonths;
  const isDesiredMonthsInvalid =
    leaveType === LeaveType.ANNUAL &&
    desiredMonthsValidation &&
    !desiredMonthsValidation.is_valid;

  const canSubmit =
    !isCalculating &&
    !isValidatingDesiredMonths &&
    !!calculatedEndDate &&
    !isAnnualLeaveBlocked &&
    !isDesiredMonthsInvalid &&
    (leaveType !== LeaveType.STUDY || !!studyProgram);

  const onSubmit = async (data: LeaveFormData) => {
    if (!canSubmit) return;

    await createMutation.mutateAsync({
      ...data,
      end_date: calculatedEndDate,
      working_days: workingDays,
    });

    reset();
    setWorkingDays(1);
    onSuccess?.();
  };

  const handleDesiredMonthsClose = () => {
    onDesiredMonthsClose();
    refetchDesiredMonths();
  };

  // ── Render helpers ──────────────────────────────────────────────────────
  const isStudy = leaveType === LeaveType.STUDY;
  const endDateLabel = isStudy
    ? "PROGRAM END DATE"
    : "END DATE (Last day of leave)";
  const resumptionLabel = isStudy
    ? "RETURN TO WORK DATE"
    : "RESUMPTION DATE (Return to work)";

  let durationDisplay: string;
  if (isStudy) {
    durationDisplay =
      STUDY_PROGRAMS.find((p) => p.value === studyProgram)?.duration || "";
  } else {
    const fixed = getFixedDuration(leaveType);
    if (fixed !== null) {
      durationDisplay = `${fixed} ${fixed === 1 ? "day" : "days"}`;
    } else {
      durationDisplay = `${workingDays} ${workingDays === 1 ? "day" : "days"}`;
    }
  }

  const selectedDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = addWeeks(today, 2);
  const isLessThanNotice = selectedDate < minDate;

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      bg="white"
      p={cardPadding}
      borderRadius="lg"
      boxShadow="md"
      w="100%"
    >
      <VStack spacing={spacing.stackSpacing.lg} align="stretch">
        {/* Header */}
        <Box>
          <Text fontSize={isMobile ? "xl" : "2xl"} fontWeight="bold" mb={1}>
            Apply for Leave
          </Text>
          <Text fontSize={fontSizes.body.small} color="gray.600">
            Fill in the details below to submit your leave request
          </Text>
        </Box>

        <Divider />

        {/* Leave Type Selection */}
        <FormControl isInvalid={!!errors.leave_type} isRequired>
          <FormLabel fontSize={fontSizes.body.small} fontWeight="bold">
            Leave Type
          </FormLabel>
          <Select
            {...register("leave_type", { required: true })}
            size={formSize}
            fontSize={fontSizes.body.medium}
          >
            {LEAVE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {leaveType && (
            <FormHelperText fontSize={fontSizes.body.caption}>
              {
                LEAVE_TYPE_OPTIONS.find((o) => o.value === leaveType)
                  ?.description
              }
            </FormHelperText>
          )}
        </FormControl>

        {/* STUDY LEAVE: Program Selection */}
        {leaveType === LeaveType.STUDY && (
          <FormControl isRequired isInvalid={!!errors.study_program}>
            <FormLabel fontSize={fontSizes.body.small} fontWeight="bold">
              Study Program
            </FormLabel>
            <Select
              {...register("study_program", {
                required:
                  leaveType === LeaveType.STUDY
                    ? "Study program is required"
                    : false,
              })}
              size={formSize}
              placeholder="Select program"
              fontSize={fontSizes.body.medium}
            >
              {STUDY_PROGRAMS.map((program) => (
                <option key={program.value} value={program.value}>
                  {program.label} - {program.duration}
                </option>
              ))}
            </Select>
            <FormErrorMessage fontSize={fontSizes.body.small}>
              {errors.study_program?.message}
            </FormErrorMessage>
            {studyProgram && (
              <FormHelperText fontSize={fontSizes.body.caption}>
                <Icon as={FiBook} mr={1} />
                Duration:{" "}
                {STUDY_PROGRAMS.find((p) => p.value === studyProgram)?.duration}
              </FormHelperText>
            )}
          </FormControl>
        )}

        {/* Annual Leave - Desired Months Check */}
        {isAnnualLeaveBlocked && (
          <Alert
            status="warning"
            borderRadius="md"
            variant="left-accent"
            flexDirection={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <AlertIcon boxSize={isMobile ? 4 : 5} />
            <Box flex="1" w="100%">
              <AlertTitle fontSize={isMobile ? "sm" : "md"}>
                Desired Leave Months Required
              </AlertTitle>
              <AlertDescription fontSize={isMobile ? "xs" : "sm"} mt={1}>
                Before applying for annual leave, you need to select your 2
                desired leave months.
                <Box mt={2}>
                  <Link
                    color="blue.600"
                    fontWeight="bold"
                    onClick={onDesiredMonthsOpen}
                    cursor="pointer"
                    textDecoration="underline"
                    _hover={{ color: "blue.800" }}
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={FiCalendar} boxSize={4} />
                    Click here to select your desired months
                  </Link>
                </Box>
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Show desired months for annual leave */}
        {leaveType === LeaveType.ANNUAL && desiredMonths && (
          <Alert
            status="info"
            borderRadius="md"
            variant="left-accent"
            flexDirection={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <AlertIcon boxSize={isMobile ? 4 : 5} />
            <Box flex="1" w="100%">
              <HStack justify="space-between" mb={1} flexWrap="wrap" gap={1}>
                <AlertTitle fontSize={isMobile ? "xs" : "sm"}>
                  Your Desired Leave Months
                </AlertTitle>
                <Badge colorScheme="green" fontSize="xs">
                  <HStack spacing={1}>
                    <Icon as={FiCheckCircle} boxSize={3} />
                    <Text>Submitted</Text>
                  </HStack>
                </Badge>
              </HStack>
              <AlertDescription fontSize={isMobile ? "xs" : "sm"} mt={1}>
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                  {desiredMonths.preferred_months.map((monthNum) => {
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    return (
                      <Badge
                        key={monthNum}
                        colorScheme="blue"
                        fontSize={isMobile ? "2xs" : "xs"}
                        px={2}
                        py={1}
                      >
                        {monthNames[monthNum - 1]}
                      </Badge>
                    );
                  })}
                </Stack>
                <Text fontSize="xs" color="gray.600">
                  Your annual leave must fall within these months
                </Text>
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Balance Alert */}
        {!isStudy && currentBalance && (
          <Alert
            status={currentBalance.available_days < 5 ? "warning" : "info"}
            borderRadius="md"
            flexDirection={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <AlertIcon boxSize={isMobile ? 4 : 5} />
            <Box flex="1" w="100%">
              <AlertTitle fontSize={isMobile ? "xs" : "sm"}>
                Current Balance
              </AlertTitle>
              <AlertDescription fontSize={isMobile ? "xs" : "sm"}>
                Available: <strong>{currentBalance.available_days} days</strong>
                {" / "}
                Allocated: {currentBalance.allocated_days} days
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Date Selection */}
        {isFixedDurationLeave ? (
          <FormControl isInvalid={!!errors.start_date} isRequired>
            <FormLabel fontSize={fontSizes.body.small} fontWeight="bold">
              Start Date
            </FormLabel>
            <Input
              type="date"
              {...register("start_date", {
                required: "Start date is required",
              })}
              size={formSize}
              isDisabled={isAnnualLeaveBlocked}
              min={format(new Date(), "yyyy-MM-dd")}
            />
            <FormHelperText fontSize={fontSizes.body.caption}>
              <Icon as={FiCalendar} mr={1} />
              Default: 14 days from today (recommended notice period)
            </FormHelperText>
            {isLessThanNotice && (
              <FormHelperText
                color="orange.500"
                fontSize={fontSizes.body.caption}
              >
                <Icon as={FiAlertTriangle} mr={1} />
                Less than 14 days notice. Please ensure sufficient notice.
              </FormHelperText>
            )}
            <FormErrorMessage fontSize={fontSizes.body.small}>
              {errors.start_date?.message}
            </FormErrorMessage>
          </FormControl>
        ) : (
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={spacing.stackSpacing.md}
            align="flex-start"
            w="100%"
          >
            <FormControl isInvalid={!!errors.start_date} isRequired flex="1">
              <FormLabel fontSize={fontSizes.body.small} fontWeight="bold">
                Start Date
              </FormLabel>
              <Input
                type="date"
                {...register("start_date", {
                  required: "Start date is required",
                })}
                size={formSize}
                isDisabled={isAnnualLeaveBlocked}
                min={format(new Date(), "yyyy-MM-dd")}
                w="100%"
              />
              {isLessThanNotice && (
                <FormHelperText
                  color="orange.500"
                  fontSize={fontSizes.body.caption}
                >
                  <Icon as={FiAlertTriangle} mr={1} />
                  Less than 14 days notice
                </FormHelperText>
              )}
              <FormErrorMessage fontSize={fontSizes.body.small}>
                {errors.start_date?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired flex="1">
              <FormLabel fontSize={fontSizes.body.small} fontWeight="bold">
                Working Days
              </FormLabel>
              <NumberInput
                value={workingDays}
                onChange={(_, value) => setWorkingDays(value || 1)}
                min={1}
                max={currentBalance?.available_days || 365}
                size={formSize}
                isDisabled={isAnnualLeaveBlocked}
                w="100%"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText fontSize={fontSizes.body.caption}>
                Excludes weekends & holidays
              </FormHelperText>
            </FormControl>
          </Stack>
        )}

        {/* Calculated Summary - Mobile Responsive */}
        {calculatedEndDate && !isAnnualLeaveBlocked && (
          <Alert
            status={isLessThanNotice ? "warning" : "info"}
            variant="left-accent"
            borderRadius="md"
            bg={isLessThanNotice ? "orange.50" : "blue.50"}
          >
            <Box flex="1" w="100%">
              <AlertTitle
                fontSize={isMobile ? "sm" : "md"}
                mb={isMobile ? 2 : 3}
                color={isLessThanNotice ? "orange.900" : "blue.900"}
              >
                📊 Leave Summary
              </AlertTitle>

              <SimpleGrid columns={summaryColumns} spacing={spacing.gaps.md}>
                <SummaryItem
                  label={endDateLabel}
                  value={formatDisplayDate(calculatedEndDate)}
                  color="orange.700"
                  isMobile={isMobile}
                />
                <SummaryItem
                  label={resumptionLabel}
                  value={formatDisplayDate(resumptionDate)}
                  color="green.700"
                  isMobile={isMobile}
                />
              </SimpleGrid>

              <Divider my={spacing.gaps.md} />

              <Stack
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                spacing={spacing.gaps.sm}
              >
                <HStack spacing={2} flexWrap="wrap">
                  <Text fontSize={isMobile ? "xs" : "sm"} fontWeight="bold">
                    {isStudy ? "Program Duration:" : "Leave Duration:"}
                  </Text>
                  <Badge
                    colorScheme="purple"
                    fontSize={isMobile ? "xs" : "sm"}
                    px={2}
                  >
                    {durationDisplay}
                  </Badge>
                </HStack>

                <HStack spacing={2} flexWrap="wrap">
                  <Text
                    fontSize={isMobile ? "xs" : "sm"}
                    fontWeight="bold"
                    color={isLessThanNotice ? "orange.600" : "blue.600"}
                  >
                    Notice Period:
                  </Text>
                  <Badge
                    colorScheme={isLessThanNotice ? "orange" : "blue"}
                    fontSize={isMobile ? "xs" : "sm"}
                    px={2}
                  >
                    {isLessThanNotice
                      ? "⚠️ Less than 14 days"
                      : "14 days (recommended)"}
                  </Badge>
                </HStack>
              </Stack>
            </Box>
          </Alert>
        )}

        {/* Desired Months Validation */}
        {desiredMonthsValidation &&
          leaveType === LeaveType.ANNUAL &&
          !isValidatingDesiredMonths && (
            <Alert
              status={desiredMonthsValidation.is_valid ? "success" : "error"}
              borderRadius="md"
              variant="left-accent"
              flexDirection={{ base: "column", sm: "row" }}
              alignItems={{ base: "flex-start", sm: "center" }}
            >
              <AlertIcon
                as={
                  desiredMonthsValidation.is_valid
                    ? FiCheckCircle
                    : FiAlertTriangle
                }
                boxSize={isMobile ? 4 : 5}
              />
              <Box flex="1" w="100%">
                <AlertTitle fontSize={isMobile ? "xs" : "sm"}>
                  {desiredMonthsValidation.is_valid
                    ? "Dates Valid ✓"
                    : "Invalid Date Selection"}
                </AlertTitle>
                <AlertDescription fontSize={isMobile ? "xs" : "sm"} mt={0.5}>
                  {desiredMonthsValidation.message}
                </AlertDescription>
              </Box>
            </Alert>
          )}

        {/* Reason Field */}
        <FormControl isInvalid={!!errors.reason} isRequired>
          <FormLabel fontSize={fontSizes.body.small} fontWeight="bold">
            Reason for Leave
          </FormLabel>
          <Textarea
            {...register("reason", {
              required: "Reason is required",
              minLength: { value: 10, message: "Minimum 10 characters" },
            })}
            placeholder={
              isStudy
                ? "Institution name, course details, etc..."
                : "Provide a detailed reason..."
            }
            size={formSize}
            rows={isMobile ? 3 : 4}
            isDisabled={isAnnualLeaveBlocked}
            fontSize={fontSizes.body.medium}
          />
          <FormErrorMessage fontSize={fontSizes.body.small}>
            {errors.reason?.message}
          </FormErrorMessage>
        </FormControl>

        {/* Error Display */}
        {createMutation.error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription fontSize={isMobile ? "sm" : "md"}>
              {(createMutation.error as Error).message}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions - Mobile Responsive */}
        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={spacing.gaps.md}
          justify="flex-end"
          pt={spacing.gaps.md}
          w="100%"
        >
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              isDisabled={createMutation.isPending}
              size={buttonSize}
              w={{ base: "100%", sm: "auto" }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={createMutation.isPending || isCalculating}
            loadingText={isCalculating ? "Calculating..." : "Submitting..."}
            size={buttonSize}
            isDisabled={!canSubmit}
            w={{ base: "100%", sm: "auto" }}
          >
            Submit Leave Request
          </Button>
        </Stack>
      </VStack>

      {/* Desired Months Modal */}
      <DesiredLeaveMonthsForm
        isOpen={isDesiredMonthsOpen}
        onClose={handleDesiredMonthsClose}
        canClose={true}
      />
    </Box>
  );
};

// ── Summary Item Component ──
interface SummaryItemProps {
  label: string;
  value: string;
  color: string;
  isMobile?: boolean;
}

const SummaryItem = ({ label, value, color, isMobile }: SummaryItemProps) => (
  <Box
    p={isMobile ? 2 : 3}
    bg="white"
    borderRadius="md"
    border="1px solid"
    borderColor="gray.100"
  >
    <Text
      fontSize={isMobile ? "2xs" : "xs"}
      color="gray.600"
      fontWeight="semibold"
      mb={1}
      letterSpacing="0.05em"
    >
      {label}
    </Text>
    <HStack spacing={1}>
      <Icon as={FiCalendar} boxSize={isMobile ? 3 : 4} color={color} />
      <Text fontSize={isMobile ? "sm" : "md"} fontWeight="bold" color={color}>
        {value}
      </Text>
    </HStack>
  </Box>
);
