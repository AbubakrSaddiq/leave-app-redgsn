// ============================================
// Leave Type Configuration Hook 
// ============================================

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { leaveTypeConfigService } from "@/services/leaveTypeConfigService";
import type { LeaveTypeConfig, LeaveTypeConfigFormData, LeaveType } from "@/types/leaveType";
import { LEAVE_TYPE_LABELS } from "@/types/leaveType";

export const useLeaveTypeConfigs = () => {
  const [configs, setConfigs] = useState<LeaveTypeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaveTypeConfigService.getAllConfigs();
      setConfigs(data);
    } catch (error: any) {
      const errorMessage = error.message || "Error loading configurations";
      setError(errorMessage);
      toast({
        title: "Error loading configurations",
        description: errorMessage,
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const createConfig = useCallback(async (data: LeaveTypeConfigFormData) => {
    try {
      const newConfig = await leaveTypeConfigService.createConfig(data);
      setConfigs(prev => [...prev, newConfig]);
      toast({
        title: "Configuration created",
        description: `${LEAVE_TYPE_LABELS[data.leave_type]} has been configured`,
        status: "success",
        duration: 3000,
      });
      return newConfig;
    } catch (error: any) {
      const errorMessage = error.message || "Creation failed";
      toast({
        title: "Creation failed",
        description: errorMessage,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  const updateConfig = useCallback(async (leaveType: LeaveType, data: Partial<LeaveTypeConfigFormData>) => {
    try {
      console.log("Updating config for:", leaveType, "with data:", data);
      
      const updatedConfig = await leaveTypeConfigService.updateConfig(leaveType, data);
      
      setConfigs(prev => prev.map(c => 
        c.leave_type === leaveType ? updatedConfig : c
      ));
      
      // If the config wasn't in the list (was created during update), add it
      setConfigs(prev => {
        const exists = prev.some(c => c.leave_type === leaveType);
        if (!exists) {
          return [...prev, updatedConfig];
        }
        return prev;
      });
      
      toast({
        title: "Configuration saved",
        description: `${LEAVE_TYPE_LABELS[leaveType]} has been updated`,
        status: "success",
        duration: 3000,
      });
      return updatedConfig;
    } catch (error: any) {
      const errorMessage = error.message || "Update failed";
      console.error("Update error details:", error);
      toast({
        title: "Update failed",
        description: errorMessage,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  const deleteConfig = useCallback(async (leaveType: LeaveType) => {
    try {
      await leaveTypeConfigService.deleteConfig(leaveType);
      setConfigs(prev => prev.filter(c => c.leave_type !== leaveType));
      toast({
        title: "Configuration deleted",
        description: `${LEAVE_TYPE_LABELS[leaveType]} has been removed`,
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Deletion failed";
      toast({
        title: "Deletion failed",
        description: errorMessage,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  return {
    configs,
    loading,
    error,
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
  };
};