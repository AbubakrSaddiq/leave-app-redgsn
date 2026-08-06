import React, { createContext, useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { Profile } from "@/types/auth";
import { authService } from "@/services/authService";
import { supabase } from "@/lib/supabase";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { SessionTimeoutModal } from "@/components/auth/SessionTimeoutModal";

// Total inactivity allowed before logout, and how long the
// warning modal is shown before the session actually expires
const IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const WARNING_DURATION_MS = 60 * 1000; // 1 minute

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTimeoutWarningOpen, setIsTimeoutWarningOpen] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getCurrentProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();

    // Listen for auth changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      loadProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSessionExpire = useCallback(async () => {
    setIsTimeoutWarningOpen(false);
    try {
      await authService.signOut();
      queryClient.clear();
      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity.",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error signing out after inactivity:", error);
    }
  }, [queryClient, toast]);

  const { reset: resetIdleTimer } = useIdleTimer({
    timeout: IDLE_TIMEOUT_MS - WARNING_DURATION_MS,
    onIdle: () => setIsTimeoutWarningOpen(true),
    enabled: !!profile && !isTimeoutWarningOpen,
  });

  const handleStayLoggedIn = useCallback(() => {
    setIsTimeoutWarningOpen(false);
    resetIdleTimer();
  }, [resetIdleTimer]);

  return (
    <AuthContext.Provider
      value={{ profile, isLoading, refreshProfile: loadProfile }}
    >
      {children}
      {profile && (
        <SessionTimeoutModal
          isOpen={isTimeoutWarningOpen}
          countdownSeconds={WARNING_DURATION_MS / 1000}
          onStayLoggedIn={handleStayLoggedIn}
          onExpire={handleSessionExpire}
        />
      )}
    </AuthContext.Provider>
  );
};
