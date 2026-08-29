// src/components/notifications/NotificationDropdown.tsx
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  Spinner,
  Center,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  useMyNotifications,
  useUnreadNotificationCount,
} from "@/hooks/useNotifications";
import { useMarkNotificationAsRead } from "@/hooks/useNotifications";
import { useDeleteNotification } from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

interface NotificationDropdownProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { data: unreadCount } = useUnreadNotificationCount();
  const { data: notificationsData, isLoading } = useMyNotifications({
    limit: 10,
  });
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();

  const notifications = notificationsData?.data || [];
  const totalCount = notificationsData?.count || 0;

  const bgColor = useColorModeValue("gray.50", "gray.700");

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleViewAll = () => {
    onClose?.();
    navigate("/notifications");
  };

  const handleMarkAllRead = async () => {
    const { markAllNotificationsAsRead } =
      await import("@/api/notifications.api");
    await markAllNotificationsAsRead();
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-end"
      closeOnBlur={true}
    >
      <PopoverTrigger>
        <Button
          variant="ghost"
          size="sm"
          position="relative"
          aria-label="Notifications"
          p={2}
          minW="auto"
        >
          <Icon as={FiBell} boxSize={5} color="gray.600" />
          {unreadCount && unreadCount > 0 && (
            <Badge
              position="absolute"
              top="0"
              right="0"
              transform="translate(4px, -4px)"
              colorScheme="red"
              borderRadius="full"
              fontSize="10px"
              px={1.5}
              minW="18px"
              textAlign="center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        width={{ base: "90vw", sm: "400px" }}
        maxH="500px"
        boxShadow="lg"
        borderRadius="lg"
      >
        <PopoverArrow />

        {/* Header */}
        <HStack
          justify="space-between"
          p={3}
          borderBottom="1px solid"
          borderColor="gray.100"
        >
          <Text fontWeight="bold">Notifications</Text>
          {unreadCount && unreadCount > 0 && (
            <Badge colorScheme="blue" borderRadius="full">
              {unreadCount} unread
            </Badge>
          )}
        </HStack>

        {/* Body */}
        <PopoverBody p={0} overflowY="auto" maxH="350px">
          {isLoading ? (
            <Center py={8}>
              <Spinner size="md" />
            </Center>
          ) : notifications.length === 0 ? (
            <Center py={8} flexDirection="column">
              <Icon as={FiBell} boxSize={8} color="gray.300" />
              <Text color="gray.500" mt={2} fontSize="sm">
                No notifications
              </Text>
            </Center>
          ) : (
            <VStack spacing={0} align="stretch">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  isRead={notification.is_read}
                />
              ))}
              {totalCount > 10 && (
                <Center py={2} bg="gray.50">
                  <Text fontSize="xs" color="gray.500">
                    + {totalCount - 10} more notifications
                  </Text>
                </Center>
              )}
            </VStack>
          )}
        </PopoverBody>

        {/* Footer - Fixed: Removed borderRadiusBottom */}
        <PopoverFooter
          p={2}
          borderTop="1px solid"
          borderColor="gray.100"
          bg={bgColor}
          borderBottomRadius="lg" // Fixed: Changed from borderRadiusBottom to borderBottomRadius
        >
          <HStack spacing={2} justify="space-between">
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={handleViewAll}
            >
              View All
            </Button>
            <HStack spacing={2}>
              {unreadCount && unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="green"
                  leftIcon={<FiCheck />}
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </Button>
              )}
            </HStack>
          </HStack>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
