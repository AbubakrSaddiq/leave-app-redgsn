// src/components/leaves/LeaveApplicationForm.tsx
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
} from "@chakra-ui/react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCalendar,
  FiBook,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useCreateLeaveApplication } from "@/hooks/useLeaveApplication";
import {
  LEAVE_TYPE_OPTIONS,
  STUDY_PROGRAMS,
  getFixedDuration, // NEW: import helper
} from "@/constants/leaveConstants";
import { formatDisplayDate } from "@/utils/dateUtils";
import { format, addYears, subDays, addDays } from "date-fns"; // added addDays
import { LeaveType } from "@/types/models";
import {
  useValidateLeaveDates,
  useMyDesiredMonths,
} from "@/hooks/useDesiredLeaveMonths";
import { useMyLeaveBalances } from "@/hooks/useLeaveBalance";
import { DesiredLeaveMonthsForm } from "@/components/desiredMonths/DesiredLeaveMonthsForm";
import { leaveService } from "@/services/leaveService";

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
  // Modal control for desired months form
  const {
    isOpen: isDesiredMonthsOpen,
    onOpen: onDesiredMonthsOpen,
    onClose: onDesiredMonthsClose,
  } = useDisclosure();

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
      start_date: format(new Date(), "yyyy-MM-dd"),
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

    // Clear study_program when not study leave
    if (leaveType !== LeaveType.STUDY) {
      setValue("study_program", undefined);
    }
  }, [leaveType, setValue]);

  // ── Calculate end date ────────────────────────────────────────────────────
  useEffect(() => {
    // Skip if startDate is not set
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
      const end = addDays(start, fixedDays - 1); // inclusive end date
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
  // Determine labels for the summary
  const isStudy = leaveType === LeaveType.STUDY;
  const endDateLabel = isStudy
    ? "PROGRAM END DATE"
    : "END DATE (Last day of leave)";
  const resumptionLabel = isStudy
    ? "RETURN TO WORK DATE"
    : "RESUMPTION DATE (Return to work)";

  // Duration display
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

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="md"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Apply for Leave
          </Text>
          <Text color="gray.600">
            Fill in the details below to submit your leave request
          </Text>
        </Box>

        <Divider />

        {/* Leave Type Selection */}
        <FormControl isInvalid={!!errors.leave_type} isRequired>
          <FormLabel>Leave Type</FormLabel>
          <Select {...register("leave_type", { required: true })} size="lg">
            {LEAVE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {leaveType && (
            <FormHelperText>
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
            <FormLabel>Study Program</FormLabel>
            <Select
              {...register("study_program", {
                required:
                  leaveType === LeaveType.STUDY
                    ? "Study program is required"
                    : false,
              })}
              size="lg"
              placeholder="Select program"
            >
              {STUDY_PROGRAMS.map((program) => (
                <option key={program.value} value={program.value}>
                  {program.label} - {program.duration}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.study_program?.message}</FormErrorMessage>
            {studyProgram && (
              <FormHelperText>
                <Icon as={FiBook} mr={1} />
                Duration:{" "}
                {STUDY_PROGRAMS.find((p) => p.value === studyProgram)?.duration}
              </FormHelperText>
            )}
          </FormControl>
        )}

        {/* Annual Leave - Desired Months Check */}
        {isAnnualLeaveBlocked && (
          <Alert status="warning" borderRadius="md" variant="left-accent">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Desired Leave Months Required</AlertTitle>
              <AlertDescription fontSize="sm" mt={2}>
                Before applying for annual leave, you need to select your 2
                desired leave months.
                <br />
                <Link
                  color="blue.600"
                  fontWeight="bold"
                  onClick={onDesiredMonthsOpen}
                  cursor="pointer"
                  textDecoration="underline"
                  _hover={{ color: "blue.800" }}
                  mt={2}
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={FiCalendar} />
                  Click here to select your desired months
                </Link>
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Show desired months for annual leave */}
        {leaveType === LeaveType.ANNUAL && desiredMonths && (
          <Alert status="info" borderRadius="md" variant="left-accent">
            <AlertIcon />
            <Box flex="1">
              <HStack justify="space-between" mb={2}>
                <AlertTitle fontSize="sm">Your Desired Leave Months</AlertTitle>
                <Badge colorScheme="green" fontSize="xs">
                  <HStack spacing={1}>
                    <Icon as={FiCheckCircle} boxSize={3} />
                    <Text>Submitted</Text>
                  </HStack>
                </Badge>
              </HStack>
              <AlertDescription fontSize="sm" mt={2}>
                <HStack spacing={2} flexWrap="wrap">
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
                        fontSize="xs"
                        px={2}
                        py={1}
                      >
                        {monthNames[monthNum - 1]}
                      </Badge>
                    );
                  })}
                </HStack>
                <Text fontSize="xs" mt={2} color="gray.600">
                  Your annual leave must fall within these months
                </Text>
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Balance Alert (not for study leave) */}
        {!isStudy && currentBalance && (
          <Alert
            status={currentBalance.available_days < 5 ? "warning" : "info"}
            borderRadius="md"
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Current Balance</AlertTitle>
              <AlertDescription>
                Available: <strong>{currentBalance.available_days} days</strong>
                {" / "}
                Allocated: {currentBalance.allocated_days} days
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Date Selection */}
        {isFixedDurationLeave ? (
          // Fixed duration leaves: only Start Date (no working days input)
          <FormControl isInvalid={!!errors.start_date} isRequired>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              {...register("start_date", {
                required: "Start date is required",
              })}
              size="lg"
              min={format(new Date(), "yyyy-MM-dd")}
              isDisabled={isAnnualLeaveBlocked}
            />
            <FormErrorMessage>{errors.start_date?.message}</FormErrorMessage>
            {leaveType === LeaveType.STUDY && (
              <FormHelperText>
                Select when your study program begins
              </FormHelperText>
            )}
            {(leaveType === LeaveType.PATERNITY ||
              leaveType === LeaveType.MATERNITY) && (
              <FormHelperText>
                Leave duration is fixed at {getFixedDuration(leaveType)}{" "}
                calendar days
              </FormHelperText>
            )}
          </FormControl>
        ) : (
          // Regular leaves: Start Date + Working Days
          <HStack spacing={4} align="flex-start">
            <FormControl isInvalid={!!errors.start_date} isRequired flex={1}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                {...register("start_date", {
                  required: "Start date is required",
                })}
                size="lg"
                min={format(new Date(), "yyyy-MM-dd")}
                isDisabled={isAnnualLeaveBlocked}
              />
              <FormErrorMessage>{errors.start_date?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired flex={1}>
              <FormLabel>Working Days</FormLabel>
              <NumberInput
                value={workingDays}
                onChange={(_, value) => setWorkingDays(value || 1)}
                min={1}
                max={currentBalance?.available_days || 365}
                size="lg"
                isDisabled={isAnnualLeaveBlocked}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>Excludes weekends & holidays</FormHelperText>
            </FormControl>
          </HStack>
        )}

        {/* Calculated Summary */}
        {calculatedEndDate && !isAnnualLeaveBlocked && (
          <Alert
            status="info"
            variant="left-accent"
            borderRadius="md"
            bg="blue.50"
          >
            <Box flex="1">
              <AlertTitle fontSize="md" mb={3} color="blue.900">
                📊 Leave Summary
              </AlertTitle>
              <VStack align="stretch" spacing={3}>
                <SummaryItem
                  label={endDateLabel}
                  value={formatDisplayDate(calculatedEndDate)}
                  color="orange.700"
                />
                <SummaryItem
                  label={resumptionLabel}
                  value={formatDisplayDate(resumptionDate)}
                  color="green.700"
                />
                <Divider />
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="bold">
                    {isStudy ? "Program Duration:" : "Leave Duration:"}
                  </Text>
                  <Badge colorScheme="purple" fontSize="md" px={3}>
                    {durationDisplay}
                  </Badge>
                </HStack>
              </VStack>
            </Box>
          </Alert>
        )}

        {/* Desired Months Validation (Annual Leave Only) */}
        {desiredMonthsValidation &&
          leaveType === LeaveType.ANNUAL &&
          !isValidatingDesiredMonths && (
            <Alert
              status={desiredMonthsValidation.is_valid ? "success" : "error"}
              borderRadius="md"
              variant="left-accent"
            >
              <AlertIcon
                as={
                  desiredMonthsValidation.is_valid
                    ? FiCheckCircle
                    : FiAlertTriangle
                }
              />
              <Box flex="1">
                <AlertTitle fontSize="sm">
                  {desiredMonthsValidation.is_valid
                    ? "Dates Valid ✓"
                    : "Invalid Date Selection"}
                </AlertTitle>
                <AlertDescription fontSize="sm" mt={1}>
                  {desiredMonthsValidation.message}
                </AlertDescription>
              </Box>
            </Alert>
          )}

        {/* Reason Field */}
        <FormControl isInvalid={!!errors.reason} isRequired>
          <FormLabel>Reason for Leave</FormLabel>
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
            size="lg"
            rows={4}
            isDisabled={isAnnualLeaveBlocked}
          />
          <FormErrorMessage>{errors.reason?.message}</FormErrorMessage>
        </FormControl>

        {/* Error Display */}
        {createMutation.error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              {(createMutation.error as Error).message}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <HStack spacing={4} justify="flex-end" pt={4}>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              isDisabled={createMutation.isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={createMutation.isPending || isCalculating}
            loadingText={isCalculating ? "Calculating..." : "Submitting..."}
            size="lg"
            isDisabled={!canSubmit}
          >
            Submit Leave Request
          </Button>
        </HStack>
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

const SummaryItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <Box p={3} bg="white" borderRadius="md">
    <Text fontSize="xs" color="gray.600" fontWeight="semibold" mb={1}>
      {label}
    </Text>
    <Text fontSize="md" fontWeight="bold" color={color}>
      📅 {value}
    </Text>
  </Box>
);
