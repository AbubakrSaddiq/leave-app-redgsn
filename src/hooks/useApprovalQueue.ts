// src/hooks/useApprovalQueue.ts
import { useState } from "react";
import { 
  useLeaveApplications, 
  useApproveLeaveApplication, 
  useRejectLeaveApplication 
} from "@/hooks/useLeaveApplication";
import { LeaveStatus, LeaveApplication } from "@/types/models";

export const useApprovalQueue = (role: "director" | "hr") => {
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "all">("all");

  // Define what "pending" means for the current user (including resumption)
  const rolePendingStatuses = role === "director" 
    ? [LeaveStatus.PENDING_DIRECTOR, LeaveStatus.PENDING_RESUMPTION_DIRECTOR]
    : [LeaveStatus.PENDING_HR, LeaveStatus.PENDING_RESUMPTION_HR];

  // Determine which statuses to fetch
  let queryStatuses: LeaveStatus[];
  if (statusFilter === "all") {
    queryStatuses = rolePendingStatuses;
  } else {
    queryStatuses = [statusFilter as LeaveStatus];
  }

  const { data, isLoading, error } = useLeaveApplications({
    status: queryStatuses,
    page: 1,
    limit: 50,
  });

  const approveMutation = useApproveLeaveApplication();
  const rejectMutation = useRejectLeaveApplication();

  const handleApprove = async (id: string, comments?: string) => {
    // Check if this is a resumption request
    const application = applications.find(app => app.id === id);
    const isResumption = application?.status === LeaveStatus.PENDING_RESUMPTION_DIRECTOR || 
                         application?.status === LeaveStatus.PENDING_RESUMPTION_HR;

    if (isResumption) {
      // For resumption: Director moves to PENDING_RESUMPTION_HR, HR moves to RESUMED
      const nextStatus = role === "director" 
        ? LeaveStatus.PENDING_RESUMPTION_HR 
        : LeaveStatus.RESUMED;
      
      return approveMutation.mutateAsync({
        id,
        status: nextStatus,
        comments: comments || "Resumption approved",
        isResumption: true,
      });
    } else {
      // For regular leave: Director moves to PENDING_HR, HR moves to APPROVED
      const nextStatus = role === "director" 
        ? LeaveStatus.PENDING_HR 
        : LeaveStatus.APPROVED;

      return approveMutation.mutateAsync({
        id,
        status: nextStatus,
        comments: comments || "Approved",
        isResumption: false,
      });
    }
  };

  const handleReject = async (id: string, comments: string) => {
    // Check if this is a resumption request
    const application = applications.find(app => app.id === id);
    const isResumption = application?.status === LeaveStatus.PENDING_RESUMPTION_DIRECTOR || 
                         application?.status === LeaveStatus.PENDING_RESUMPTION_HR;

    return rejectMutation.mutateAsync({ 
      id, 
      comments,
      isResumption,
    });
  };

  const applications = data?.data || [];
  
  // Separate counts for regular and resumption requests
  const regularPendingCount = applications.filter(
    app => app.status === (role === "director" ? LeaveStatus.PENDING_DIRECTOR : LeaveStatus.PENDING_HR)
  ).length;
  
  const resumptionPendingCount = applications.filter(
    app => app.status === (role === "director" ? LeaveStatus.PENDING_RESUMPTION_DIRECTOR : LeaveStatus.PENDING_RESUMPTION_HR)
  ).length;

  return {
    applications,
    regularPendingCount,
    resumptionPendingCount,
    totalPendingCount: regularPendingCount + resumptionPendingCount,
    rolePendingStatuses,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    handleApprove,
    handleReject,
    isProcessing: approveMutation.isPending || rejectMutation.isPending,
  };
};