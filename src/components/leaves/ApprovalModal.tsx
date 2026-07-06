// src/components/leaves/ApprovalModal.tsx
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
  Textarea,
  VStack,
  Text,
  FormErrorMessage,
  Icon,
  HStack,
  Badge,
  Box,
} from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comments: string) => void;
  type: "approve" | "reject" | "resume";
  applicationNumber: string;
  // Custom props for resumption workflow
  customTitle?: string;
  customDescription?: string;
  customConfirmLabel?: string;
  customConfirmColor?: string;
  // Additional context for better UX
  isResumption?: boolean;
  currentStep?: "director" | "hr";
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  applicationNumber,
  customTitle,
  customDescription,
  customConfirmLabel,
  customConfirmColor,
  isResumption = false,
  currentStep,
}) => {
  const [comments, setComments] = useState("");
  const [isError, setIsError] = useState(false);

  const isApprove = type === "approve";
  const isReject = type === "reject";
  const isResume = type === "resume";

  // Determine if comments are required
  const areCommentsRequired = isReject && !isResume;

  // Reset state when modal opens/closes to prevent "ghost" data
  useEffect(() => {
    if (!isOpen) {
      setComments("");
      setIsError(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    // Validation: Rejection MUST have a reason
    if (areCommentsRequired && !comments.trim()) {
      setIsError(true);
      return;
    }

    onConfirm(comments.trim() || (isApprove ? "Approved" : "Rejected"));
    onClose();
  };

  // Determine modal content based on type and context
  const getModalContent = () => {
    // Resume action (staff requesting resumption)
    if (isResume) {
      return {
        icon: FiRefreshCw,
        iconColor: "blue.500",
        title: customTitle || "Request Resumption",
        description:
          customDescription ||
          "You are about to request resumption from this leave. Your request will be sent to your director for approval.",
        confirmLabel: customConfirmLabel || "Request Resumption",
        confirmColor: customConfirmColor || "blue",
        placeholder:
          "Any additional notes or comments about your resumption...",
        showComments: true,
        commentsRequired: false,
      };
    }

    // Resumption approval workflow
    if (isResumption) {
      if (currentStep === "director") {
        return {
          icon: FiCheckCircle,
          iconColor: "green.500",
          title: customTitle || "Approve Resumption",
          description:
            customDescription ||
            "Approve this staff member's resumption request. It will be sent to HR for final approval.",
          confirmLabel: customConfirmLabel || "Approve Resumption",
          confirmColor: customConfirmColor || "green",
          placeholder: "e.g., Handover completed, clearance verified...",
          showComments: true,
          commentsRequired: false,
        };
      } else if (currentStep === "hr") {
        return {
          icon: FiCheckCircle,
          iconColor: "teal.500",
          title: customTitle || "Finalize Resumption",
          description:
            customDescription ||
            "Finalize the resumption request and mark the staff member as resumed.",
          confirmLabel: customConfirmLabel || "Finalize Resumption",
          confirmColor: customConfirmColor || "teal",
          placeholder:
            "e.g., All clearance approved, documentation complete...",
          showComments: true,
          commentsRequired: false,
        };
      }
    }

    // Standard approve/reject actions
    if (isApprove) {
      return {
        icon: FiCheckCircle,
        iconColor: "green.500",
        title: customTitle || "Confirm Approval",
        description:
          customDescription || "Are you sure you want to approve this request?",
        confirmLabel: customConfirmLabel || "Confirm Approve",
        confirmColor: customConfirmColor || "green",
        placeholder: "e.g., Handover completed, coverage confirmed...",
        showComments: true,
        commentsRequired: false,
      };
    }

    if (isReject) {
      return {
        icon: FiXCircle,
        iconColor: "red.500",
        title: customTitle || "Confirm Rejection",
        description:
          customDescription ||
          "Please specify why this application is being rejected.",
        confirmLabel: customConfirmLabel || "Confirm Reject",
        confirmColor: customConfirmColor || "red",
        placeholder:
          "e.g., Insufficient notice period, overlapping team leave...",
        showComments: true,
        commentsRequired: true,
      };
    }

    // Fallback
    return {
      icon: FiAlertCircle,
      iconColor: "gray.500",
      title: "Confirm Action",
      description: "Please confirm your action.",
      confirmLabel: "Confirm",
      confirmColor: "blue",
      placeholder: "Add your comments...",
      showComments: true,
      commentsRequired: false,
    };
  };

  const content = getModalContent();

  // Build status badge based on context
  const getStatusBadge = () => {
    if (isResume) {
      return <Badge colorScheme="blue">Resumption Request</Badge>;
    }
    if (isResumption) {
      if (currentStep === "director") {
        return <Badge colorScheme="cyan">Director Approval</Badge>;
      }
      if (currentStep === "hr") {
        return <Badge colorScheme="teal">HR Finalization</Badge>;
      }
    }
    if (isApprove) {
      return <Badge colorScheme="green">Approval</Badge>;
    }
    if (isReject) {
      return <Badge colorScheme="red">Rejection</Badge>;
    }
    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader borderBottomWidth="1px" py={4}>
          <HStack spacing={2}>
            <Icon as={content.icon} color={content.iconColor} />
            <Text>{content.title}</Text>
            {getStatusBadge()}
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">
                Application Number:
              </Text>
              <Badge variant="outline" fontFamily="mono">
                {applicationNumber}
              </Badge>
            </HStack>

            {/* Show resumption context if applicable */}
            {isResumption && (
              <Box
                p={3}
                bg={currentStep === "director" ? "cyan.50" : "teal.50"}
                borderRadius="md"
                borderLeft="3px solid"
                borderLeftColor={
                  currentStep === "director" ? "cyan.400" : "teal.400"
                }
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={currentStep === "director" ? "cyan.700" : "teal.700"}
                >
                  {currentStep === "director"
                    ? "📋 DIRECTOR APPROVAL REQUIRED"
                    : "✅ HR FINALIZATION"}
                </Text>
                <Text fontSize="sm" mt={1}>
                  {currentStep === "director"
                    ? "This resumption request requires your approval before proceeding to HR."
                    : "This resumption request has been approved by the director. Your final approval will complete the process."}
                </Text>
              </Box>
            )}

            <Text fontWeight="medium" fontSize="md">
              {content.description}
            </Text>

            {content.showComments && (
              <FormControl isInvalid={isError}>
                <FormLabel fontSize="sm" fontWeight="bold">
                  {isApprove ? "Comments (Optional)" : "Reason for Rejection"}
                  {content.commentsRequired && " *"}
                </FormLabel>
                <Textarea
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  placeholder={content.placeholder}
                  rows={4}
                  focusBorderColor={content.confirmColor}
                />
                {isError && (
                  <FormErrorMessage>
                    <Icon as={FiAlertCircle} mr={1} />A reason is required for
                    rejection.
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" borderBottomRadius="xl" py={4}>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme={content.confirmColor}
            onClick={handleConfirm}
            px={8}
            boxShadow="sm"
            leftIcon={isResume ? <Icon as={FiRefreshCw} /> : undefined}
            _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
            isDisabled={content.commentsRequired && !comments.trim()}
          >
            {content.confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
