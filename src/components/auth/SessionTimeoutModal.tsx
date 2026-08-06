// ============================================
// SessionTimeoutModal
// Warns the user before auto-logout due to
// inactivity, with a live countdown
// ============================================

import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";

interface SessionTimeoutModalProps {
  isOpen: boolean;
  countdownSeconds: number;
  onStayLoggedIn: () => void;
  onExpire: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  isOpen,
  countdownSeconds,
  onStayLoggedIn,
  onExpire,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(countdownSeconds);

  // Reset the countdown whenever the modal opens
  useEffect(() => {
    if (isOpen) setSecondsLeft(countdownSeconds);
  }, [isOpen, countdownSeconds]);

  useEffect(() => {
    if (!isOpen) return;

    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, secondsLeft, onExpire]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onStayLoggedIn}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Session Timing Out</ModalHeader>
        <ModalBody>
          <VStack spacing={3} align="start">
            <Text>
              You've been inactive for a while. For your security, you'll be
              logged out automatically in:
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {secondsLeft}s
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onExpire}>
            Log Out Now
          </Button>
          <Button colorScheme="blue" onClick={onStayLoggedIn}>
            Stay Logged In
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SessionTimeoutModal;
