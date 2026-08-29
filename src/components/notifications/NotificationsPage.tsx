// src/components/notifications/NotificationsPage.tsx
import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spinner,
  Center,
  Icon,
  Alert,
  AlertIcon,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";
import {
  useMyNotifications,
  useMarkAllNotificationsAsRead,
  useDeleteAllReadNotifications,
} from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { useMarkNotificationAsRead } from "@/hooks/useNotifications";
import { useDeleteNotification } from "@/hooks/useNotifications";

export const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: allData, isLoading: isLoadingAll } = useMyNotifications({
    limit: 100,
  });
  const { data: unreadData, isLoading: isLoadingUnread } = useMyNotifications({
    limit: 100,
    unreadOnly: true,
  });

  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();
  const markAllReadMutation = useMarkAllNotificationsAsRead();
  const deleteAllReadMutation = useDeleteAllReadNotifications();

  const allNotifications = allData?.data || [];
  const unreadNotifications = unreadData?.data || [];
  const totalCount = allData?.count || 0;
  const unreadCount = unreadData?.count || 0;

  const isLoading = isLoadingAll || isLoadingUnread;

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleDeleteAllRead = () => {
    deleteAllReadMutation.mutate();
    onClose();
  };

  const getCurrentNotifications = () => {
    if (activeTab === 0) return allNotifications;
    return unreadNotifications;
  };

  const getCurrentCount = () => {
    if (activeTab === 0) return totalCount;
    return unreadCount;
  };

  if (isLoading) {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Loading notifications...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <HStack justify="space-between" wrap="wrap" gap={3}>
          <Box>
            <Heading size="lg" mb={1}>
              Notifications
            </Heading>
            <Text color="gray.600">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up! 🎉"}
            </Text>
          </Box>
          <HStack spacing={3}>
            {unreadCount > 0 && (
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<FiCheck />}
                onClick={handleMarkAllRead}
                isLoading={markAllReadMutation.isPending}
              >
                Mark All Read
              </Button>
            )}
            {totalCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                colorScheme="red"
                leftIcon={<FiTrash2 />}
                onClick={onOpen}
                isDisabled={totalCount === 0}
              >
                Clear Read
              </Button>
            )}
          </HStack>
        </HStack>

        <Divider />

        {/* Tabs */}
        <Tabs onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab>All ({totalCount})</Tab>
            <Tab>Unread ({unreadCount})</Tab>
          </TabList>

          <TabPanels pt={4}>
            <TabPanel p={0}>
              <NotificationsList
                notifications={allNotifications}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                emptyMessage="No notifications"
              />
            </TabPanel>
            <TabPanel p={0}>
              <NotificationsList
                notifications={unreadNotifications}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                emptyMessage="No unread notifications"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Clear Read Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Clear Read Notifications</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Text>
                This will permanently delete all read notifications. This action
                cannot be undone.
              </Text>
            </Alert>
            <Text mt={4} fontSize="sm" color="gray.600">
              You have {totalCount - unreadCount} read notification
              {totalCount - unreadCount > 1 ? "s" : ""} that will be deleted.
            </Text>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              leftIcon={<FiTrash2 />}
              onClick={handleDeleteAllRead}
              isLoading={deleteAllReadMutation.isPending}
            >
              Yes, Clear All
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// ============================================
// Helper Component
// ============================================

interface NotificationsListProps {
  notifications: any[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage: string;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  emptyMessage,
}) => {
  if (notifications.length === 0) {
    return (
      <Center py={12} flexDirection="column">
        <Icon as={FiBell} boxSize={10} color="gray.300" />
        <Text color="gray.500" mt={3} fontSize="md">
          {emptyMessage}
        </Text>
      </Center>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          isRead={notification.is_read}
        />
      ))}
    </Box>
  );
};
