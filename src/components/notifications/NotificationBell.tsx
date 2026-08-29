// src/components/notifications/NotificationBell.tsx
import React, { useState } from "react";
import { Box, Button, Icon, Badge, useDisclosure } from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { NotificationDropdown } from "./NotificationDropdown";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

export const NotificationBell: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: unreadCount } = useUnreadNotificationCount();

  return (
    <Box position="relative">
      <NotificationDropdown isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};
