
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
  const toast = useToast();

  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await leaveTypeConfigService.getAllConfigs();
      setConfigs(data);
    } catch (error: any) {
      toast({
        title: "Error loading configurations",
        description: error.message,
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
      toast({
        title: "Creation failed",
        description: error.message,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  const updateConfig = useCallback(async (leaveType: LeaveType, data: Partial<LeaveTypeConfigFormData>) => {
    try {
      const updatedConfig = await leaveTypeConfigService.updateConfig(leaveType, data);
      setConfigs(prev => prev.map(c => c.leave_type === leaveType ? updatedConfig : c));
      toast({
        title: "Configuration updated",
        description: `${LEAVE_TYPE_LABELS[leaveType]} has been updated`,
        status: "success",
        duration: 3000,
      });
      return updatedConfig;
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
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
      toast({
        title: "Deletion failed",
        description: error.message,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  return {
    configs,
    loading,
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
  };
};