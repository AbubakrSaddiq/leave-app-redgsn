// src/components/notifications/NotificationItem.tsx
import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  Badge,
  Link,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import {
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiRefreshCw,
  FiXCircle,
  FiTrash2,
} from "react-icons/fi";
import { NotificationWithDetails } from "@/api/notifications.api";

interface NotificationItemProps {
  notification: NotificationWithDetails;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isRead?: boolean;
}

const getNotificationIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    leave_submitted: FiBell,
    leave_pending_director: FiClock,
    leave_pending_hr: FiClock,
    leave_approved: FiCheckCircle,
    leave_rejected: FiXCircle,
    balance_low: FiAlertCircle,
    resumption_pending_director: FiRefreshCw,
    resumption_pending_hr: FiRefreshCw,
    resumption_approved: FiCheckCircle,
    resumption_rejected: FiXCircle,
  };
  return iconMap[type] || FiBell;
};

const getNotificationColor = (type: string) => {
  const colorMap: Record<string, string> = {
    leave_submitted: "blue",
    leave_pending_director: "orange",
    leave_pending_hr: "purple",
    leave_approved: "green",
    leave_rejected: "red",
    balance_low: "red",
    resumption_pending_director: "orange",
    resumption_pending_hr: "purple",
    resumption_approved: "green",
    resumption_rejected: "red",
  };
  return colorMap[type] || "gray";
};

const formatNotificationTitle = (type: string): string => {
  const titleMap: Record<string, string> = {
    leave_submitted: "Leave Submitted",
    leave_pending_director: "Pending Director Approval",
    leave_pending_hr: "Pending HR Approval",
    leave_approved: "Leave Approved",
    leave_rejected: "Leave Rejected",
    balance_low: "Low Leave Balance",
    resumption_pending_director: "Resumption Pending Director",
    resumption_pending_hr: "Resumption Pending HR",
    resumption_approved: "Resumption Approved",
    resumption_rejected: "Resumption Rejected",
  };
  return titleMap[type] || type;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  isRead = false,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const unreadBg = useColorModeValue("blue.50", "blue.900");

  const IconComponent = getNotificationIcon(notification.type);
  const colorScheme = getNotificationColor(notification.type);
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  // Build related leave link if available
  const relatedLink = notification.related_leave_id
    ? `/my-applications`
    : undefined;

  return (
    <Box
      p={4}
      bg={isRead ? bgColor : unreadBg}
      borderBottom="1px solid"
      borderColor="gray.100"
      _hover={{ bg: hoverBg }}
      transition="background 0.2s"
      position="relative"
    >
      <HStack align="flex-start" spacing={3}>
        {/* Icon */}
        <Box
          p={2}
          borderRadius="full"
          bg={`${colorScheme}.100`}
          color={`${colorScheme}.600`}
          flexShrink={0}
        >
          <Icon as={IconComponent} boxSize={4} />
        </Box>

        {/* Content */}
        <VStack flex={1} align="stretch" spacing={1}>
          <HStack justify="space-between">
            <Text fontWeight="bold" fontSize="sm">
              {notification.title}
            </Text>
            {!isRead && (
              <Badge colorScheme="blue" fontSize="xs" borderRadius="full">
                New
              </Badge>
            )}
          </HStack>

          <Text fontSize="sm" color="gray.600">
            {notification.message}
          </Text>

          <HStack spacing={3} flexWrap="wrap" pt={1}>
            <Text fontSize="xs" color="gray.400">
              {timeAgo}
            </Text>
            {notification.related_leave && (
              <Badge variant="subtle" colorScheme="gray" fontSize="xs">
                {notification.related_leave.application_number}
              </Badge>
            )}
          </HStack>
        </VStack>

        {/* Actions */}
        <HStack spacing={1} flexShrink={0}>
          {!isRead && (
            <IconButton
              aria-label="Mark as read"
              icon={<FiCheckCircle />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={() => onMarkAsRead(notification.id)}
            />
          )}
          <IconButton
            aria-label="Delete"
            icon={<FiTrash2 />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => onDelete(notification.id)}
          />
        </HStack>
      </HStack>
    </Box>
  );
};
