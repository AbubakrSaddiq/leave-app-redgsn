// src/components/leaves/LeaveApplicationCard.tsx
import React from "react";
import {
  Box,
  Card,
  CardBody,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Grid,
  GridItem,
  useDisclosure,
  Icon,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  FiUser,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiBook,
  FiRefreshCw,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { formatDisplayDate, calculateResumptionDate } from "@/utils/dateUtils";
import type { LeaveApplication, LeaveStatus, LeaveType } from "@/types/models";
import { ApprovalModal } from "./ApprovalModal";
import { STUDY_PROGRAMS } from "@/constants/leaveConstants";
import {
  useRequestResumption,
  useApproveResumptionDirector,
  useApproveResumptionHR,
  useRejectResumption,
} from "@/hooks/useLeaveApplication";
import { isAfter, isToday } from "date-fns";

interface LeaveApplicationCardProps {
  application: LeaveApplication;
  onApprove?: (id: string, comments: string) => void;
  onReject?: (id: string, comments: string) => void;
  showActions?: boolean;
  currentUserRole?: "staff" | "director" | "hr" | "admin";
}

export const LeaveApplicationCard: React.FC<LeaveApplicationCardProps> = ({
  application,
  onApprove,
  onReject,
  showActions = false,
  currentUserRole = "staff",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionType, setActionType] = React.useState<
    "approve" | "reject" | "resume"
  >("approve");

  // Resumption hooks
  const requestResumption = useRequestResumption();
  const approveResumptionDirector = useApproveResumptionDirector();
  const approveResumptionHR = useApproveResumptionHR();
  const rejectResumption = useRejectResumption();

  // Simplified User Data Access
  const user = application.user || (application as any).users;
  const userName = user?.full_name || "Unknown Applicant";
  const userDept = user?.department
    ? `${user.department.name} (${user.department.code})`
    : null;

  // Check if leave has ended
  const now = new Date();
  const endDate = new Date(application.end_date);
  const hasEnded = isAfter(now, endDate) || (isToday(now) && now > endDate);

  // Check if resumption should be shown (staff only, approved status, leave ended)
  const canRequestResumption =
    currentUserRole === "staff" &&
    application.status === "approved" &&
    hasEnded;

  // Check if director can act on resumption
  const canDirectorActOnResumption =
    currentUserRole === "director" &&
    application.status === "pending_resumption_director";

  // Check if HR can act on resumption
  const canHRActOnResumption =
    currentUserRole === "hr" && application.status === "pending_resumption_hr";

  // Check if resumption is in progress
  const isResumptionInProgress =
    application.status === "pending_resumption_director" ||
    application.status === "pending_resumption_hr";

  // Check if this is a regular pending leave (for approval workflow)
  const isRegularPendingLeave =
    application.status === "pending_director" ||
    application.status === "pending_hr";

  const handleOpenModal = (type: "approve" | "reject" | "resume") => {
    setActionType(type);
    onOpen();
  };

  const handleConfirmAction = (comments: string) => {
    if (actionType === "resume") {
      requestResumption.mutate(application.id);
    } else if (actionType === "approve") {
      if (application.status === "pending_resumption_director") {
        approveResumptionDirector.mutate({
          applicationId: application.id,
          comments,
        });
      } else if (application.status === "pending_resumption_hr") {
        approveResumptionHR.mutate({
          applicationId: application.id,
          comments,
        });
      } else {
        onApprove?.(application.id, comments);
      }
    } else if (actionType === "reject") {
      if (application.status === "pending_resumption_director") {
        rejectResumption.mutate({
          applicationId: application.id,
          comments,
          role: "director",
        });
      } else if (application.status === "pending_resumption_hr") {
        rejectResumption.mutate({
          applicationId: application.id,
          comments,
          role: "hr",
        });
      } else {
        onReject?.(application.id, comments);
      }
    }
    onClose();
  };

  // Determine modal props based on action
  const getModalProps = () => {
    // Resume request by staff
    if (actionType === "resume") {
      return {
        type: "resume" as const,
        customTitle: "Request Resumption",
        customDescription:
          "You are about to request resumption from this leave. Your request will be sent to your director for approval.",
        customConfirmLabel: "Request Resumption",
        customConfirmColor: "blue",
        isResumption: false,
        currentStep: undefined,
      };
    }

    // Approve resumption by director
    if (
      actionType === "approve" &&
      application.status === "pending_resumption_director"
    ) {
      return {
        type: "approve" as const,
        customTitle: "Approve Resumption",
        customDescription:
          "Approve this staff member's resumption request. It will be sent to HR for final approval.",
        customConfirmLabel: "Approve Resumption",
        customConfirmColor: "green",
        isResumption: true,
        currentStep: "director" as const,
      };
    }

    // Finalize resumption by HR
    if (
      actionType === "approve" &&
      application.status === "pending_resumption_hr"
    ) {
      return {
        type: "approve" as const,
        customTitle: "Finalize Resumption",
        customDescription:
          "Finalize the resumption request and mark the staff member as resumed.",
        customConfirmLabel: "Finalize Resumption",
        customConfirmColor: "teal",
        isResumption: true,
        currentStep: "hr" as const,
      };
    }

    // Reject resumption (director or hr)
    if (actionType === "reject" && isResumptionInProgress) {
      const step =
        application.status === "pending_resumption_director"
          ? "director"
          : "hr";
      return {
        type: "reject" as const,
        customTitle: "Reject Resumption",
        customDescription: `Reject this resumption request. The leave will remain as approved.`,
        customConfirmLabel: "Reject Resumption",
        customConfirmColor: "red",
        isResumption: true,
        currentStep: step,
      };
    }

    // Standard leave approval/rejection
    return {
      type: actionType as "approve" | "reject",
      customTitle: undefined,
      customDescription: undefined,
      customConfirmLabel: undefined,
      customConfirmColor: undefined,
      isResumption: false,
      currentStep: undefined,
    };
  };

  const modalProps = getModalProps();

  return (
    <Card
      variant="outline"
      boxShadow="sm"
      _hover={{ boxShadow: "md", borderColor: "blue.200" }}
      transition="all 0.2s"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Top Row: Type & Status */}
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Badge
                colorScheme={getLeaveTypeColor(application.leave_type)}
                variant="subtle"
              >
                {application.leave_type}
              </Badge>
              <Badge
                colorScheme={getStatusColor(application.status)}
                variant="solid"
                borderRadius="full"
              >
                {formatStatus(application.status)}
              </Badge>
            </HStack>
            <Text fontSize="xs" color="gray.400" fontFamily="mono">
              #{application.application_number}
            </Text>
          </HStack>

          {/* Study Program Badge (if study leave) */}
          {application.leave_type === "study" && application.study_program && (
            <Badge colorScheme="purple" variant="subtle" alignSelf="flex-start">
              <Icon as={FiBook} mr={1} />
              {
                STUDY_PROGRAMS.find(
                  (p) => p.value === application.study_program,
                )?.label
              }
            </Badge>
          )}

          {/* User Header */}
          <Box p={3} bg="gray.50" borderRadius="lg">
            <HStack>
              <Icon as={FiUser} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="md" lineHeight="shorter">
                  {userName}
                </Text>
                {userDept && (
                  <Text fontSize="xs" color="gray.600">
                    {userDept}
                  </Text>
                )}
              </VStack>
            </HStack>
          </Box>

          {/* Leave Metrics Grid */}
          <Grid templateColumns="repeat(2, 1fr)" gap={3}>
            <DataPoint
              icon={FiCalendar}
              label="Starts"
              value={formatDisplayDate(application.start_date)}
            />
            <DataPoint
              icon={FiCalendar}
              label="Ends"
              value={formatDisplayDate(application.end_date)}
            />
            <DataPoint
              icon={FiClock}
              label="Duration"
              value={`${application.working_days} Days`}
            />
            <DataPoint
              icon={FiMapPin}
              label="Resumption"
              value={formatDisplayDate(
                calculateResumptionDate(application.end_date),
              )}
              color="green.600"
            />
          </Grid>

          {/* Application Reason */}
          <Box>
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.500"
              mb={1}
              textTransform="uppercase"
            >
              Reason
            </Text>
            <Text
              fontSize="sm"
              color="gray.700"
              noOfLines={3}
              bg="gray.25"
              p={2}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.100"
            >
              {application.reason || "No reason provided."}
            </Text>
          </Box>

          {/* Comments Sections (Director/HR) - Original Approval */}
          <ApprovalComment
            role="Director"
            comment={application.director_comments}
            date={application.director_approved_at}
          />
          <ApprovalComment
            role="HR"
            comment={application.hr_comments}
            date={application.hr_approved_at}
          />

          {/* Resumption Status / Comments */}
          {isResumptionInProgress && (
            <Box
              p={3}
              bg="blue.50"
              borderRadius="md"
              borderLeft="3px solid"
              borderLeftColor="blue.400"
            >
              <HStack spacing={2} mb={1}>
                <Icon as={FiRefreshCw} color="blue.500" />
                <Text fontWeight="bold" fontSize="sm" color="blue.700">
                  Resumption Request{" "}
                  {application.status === "pending_resumption_director"
                    ? "Awaiting Director Approval"
                    : "Awaiting HR Approval"}
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.600">
                Requested on:{" "}
                {formatDisplayDate(application.resumption_requested_at || "")}
              </Text>
            </Box>
          )}

          {/* Resumption Comments (after approval) */}
          {application.resumption_director_comments && (
            <ApprovalComment
              role="Resumption Director"
              comment={application.resumption_director_comments}
              date={application.resumption_director_approved_at}
              colorScheme="cyan"
            />
          )}
          {application.resumption_hr_comments && (
            <ApprovalComment
              role="Resumption HR"
              comment={application.resumption_hr_comments}
              date={application.resumption_hr_approved_at}
              colorScheme="teal"
            />
          )}

          {/* ============================================ */}
          {/* ACTION BUTTONS - FIXED LOGIC */}
          {/* ============================================ */}

          <VStack spacing={3} align="stretch" pt={2}>
            {/* 1. RESUMPTION REQUEST BUTTON (for staff) */}
            {canRequestResumption && (
              <Button
                size="md"
                colorScheme="blue"
                leftIcon={<Icon as={FiRefreshCw} />}
                onClick={() => handleOpenModal("resume")}
                isLoading={requestResumption.isPending}
                loadingText="Requesting..."
                isFullWidth
              >
                Resume Work
              </Button>
            )}

            {/* 2. RESUMPTION COMPLETED - Show status message */}
            {application.status === "resumed" && (
              <Alert status="success" borderRadius="md" size="sm">
                <AlertIcon />
                <Box flex="1">
                  <Text fontWeight="bold" fontSize="sm">
                    Resumption Completed
                  </Text>
                  <Text fontSize="xs">
                    Staff has been marked as resumed on{" "}
                    {formatDisplayDate(
                      application.resumption_hr_approved_at || "",
                    )}
                  </Text>
                </Box>
              </Alert>
            )}

            {/* 3. RESUMPTION ACTION BUTTONS (Director/HR) - SHOWN INDEPENDENTLY */}
            {(canDirectorActOnResumption || canHRActOnResumption) && (
              <HStack spacing={3}>
                <Button
                  size="sm"
                  colorScheme="green"
                  flex={1}
                  leftIcon={<Icon as={FiCheck} />}
                  onClick={() => handleOpenModal("approve")}
                  isLoading={
                    approveResumptionDirector.isPending ||
                    approveResumptionHR.isPending
                  }
                >
                  {canHRActOnResumption ? "Finalize" : "Approve"}
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  flex={1}
                  leftIcon={<Icon as={FiX} />}
                  onClick={() => handleOpenModal("reject")}
                  isLoading={rejectResumption.isPending}
                >
                  Reject
                </Button>
              </HStack>
            )}

            {/* 4. REGULAR LEAVE APPROVAL ACTIONS - Requires showActions AND regular pending status */}
            {showActions && isRegularPendingLeave && (
              <HStack spacing={3}>
                <Button
                  size="sm"
                  colorScheme="green"
                  flex={1}
                  leftIcon={<Icon as={FiCheck} />}
                  onClick={() => handleOpenModal("approve")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  flex={1}
                  leftIcon={<Icon as={FiX} />}
                  onClick={() => handleOpenModal("reject")}
                >
                  Reject
                </Button>
              </HStack>
            )}
          </VStack>

          <ApprovalModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={handleConfirmAction}
            applicationNumber={application.application_number}
            {...modalProps}
          />
        </VStack>
      </CardBody>
    </Card>
  );
};

// --- Internal Helper Components ---

const DataPoint = ({ icon, label, value, color = "gray.800" }: any) => (
  <GridItem>
    <HStack spacing={2}>
      <Icon as={icon} fontSize="xs" color="gray.400" />
      <VStack align="start" spacing={0}>
        <Text
          fontSize="10px"
          color="gray.500"
          fontWeight="bold"
          textTransform="uppercase"
        >
          {label}
        </Text>
        <Text fontSize="xs" fontWeight="bold" color={color}>
          {value}
        </Text>
      </VStack>
    </HStack>
  </GridItem>
);

const ApprovalComment = ({
  role,
  comment,
  date,
  colorScheme = "blue",
}: any) => {
  if (!comment) return null;
  const isHR = role === "HR" || role === "Resumption HR";
  const isDirector = role === "Director" || role === "Resumption Director";
  const isResumption = role.startsWith("Resumption");

  let bgColor = "blue.50";
  let borderColor = "blue.400";
  let textColor = "blue.700";

  if (isResumption) {
    bgColor = "cyan.50";
    borderColor = "cyan.400";
    textColor = "cyan.700";
  } else if (isHR) {
    bgColor = "purple.50";
    borderColor = "purple.400";
    textColor = "purple.700";
  }

  return (
    <Box
      p={2}
      bg={bgColor}
      borderRadius="md"
      borderLeft="3px solid"
      borderLeftColor={borderColor}
    >
      <Text fontSize="10px" fontWeight="black" color={textColor}>
        {isResumption
          ? `RESUMPTION - ${role.replace("Resumption ", "").toUpperCase()}`
          : role.toUpperCase()}
        {!isResumption && " FEEDBACK"}
      </Text>
      <Text fontSize="xs" color="gray.800" my={1}>
        {comment}
      </Text>
      {date && (
        <Text fontSize="10px" color="gray.500 italic">
          Commented on {formatDisplayDate(date)}
        </Text>
      )}
    </Box>
  );
};

const getStatusColor = (status: LeaveStatus) => {
  const colors: Record<string, string> = {
    approved: "green",
    rejected: "red",
    pending_director: "orange",
    pending_hr: "purple",
    pending_resumption_director: "orange",
    pending_resumption_hr: "purple",
    resumed: "teal",
  };
  return colors[status] || "gray";
};

const getLeaveTypeColor = (type: LeaveType) => {
  const colors: Record<string, string> = {
    annual: "blue",
    sick: "red",
    casual: "orange",
    maternity: "pink",
    paternity: "cyan",
    study: "purple",
  };
  return colors[type] || "gray";
};

const formatStatus = (status: LeaveStatus): string => {
  const statusMap: Record<string, string> = {
    pending_director: "Pending Director",
    pending_hr: "Pending HR",
    pending_resumption_director: "Pending Resumption (Director)",
    pending_resumption_hr: "Pending Resumption (HR)",
    resumed: "Resumed",
  };
  return statusMap[status] || status.replace("_", " ");
};
