// ============================================
// Leave Application Hook
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import {
  getLeaveApplications,
  getLeaveApplication,
  createLeaveApplication,
  validateLeaveApplication,
  updateLeaveStatus,
} from '@/api/leaves.api';
import type { CreateLeaveApplicationDto, LeaveStatus, LeaveType } from '@/types/models';
import { leaveService } from '@/services/leaveService';

// ============================================
// QUERY HOOKS
// ============================================

export const useLeaveApplications = (params?: {
  status?: LeaveStatus | LeaveStatus[];
  leave_type?: LeaveType;
  user_id?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['leave-applications', params],
    queryFn: () => getLeaveApplications(params),
    staleTime: 30000,
  });
};

export const useMyLeaveApplications = (params?: {
  status?: LeaveStatus | LeaveStatus[];
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['my-leave-applications', params],
    queryFn: async () => {
      // Get current user from somewhere - we'll fix this later
      return getLeaveApplications(params);
    },
    staleTime: 30000,
  });
};

export const useLeaveApplication = (id: string) => {
  return useQuery({
    queryKey: ['leave-application', id],
    queryFn: () => getLeaveApplication(id),
    enabled: !!id,
  });
};

// Change the validate hook to match the API:
export const useValidateLeaveApplication = (
  userId: string,
  leaveType: LeaveType,
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['validate-leave', userId, leaveType, startDate, endDate],
    queryFn: () => validateLeaveApplication({ 
      leave_type: leaveType, 
      start_date: startDate, 
      end_date: endDate 
    }),
    enabled: enabled && !!userId && !!startDate && !!endDate,
    staleTime: 0,
    retry: 1,
  });
};

// ============================================
// MUTATION HOOKS - REGULAR LEAVE
// ============================================

export const useCreateLeaveApplication = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CreateLeaveApplicationDto) => createLeaveApplication(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });

      toast({
        title: 'Leave Application Submitted',
        description: `Application ${data.application_number} has been submitted.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Submission Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useApproveLeaveApplication = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ 
      id, 
      status, 
      comments 
    }: { 
      id: string; 
      status: 'approved' | 'pending_hr'; 
      comments: string 
    }) => updateLeaveStatus(id, status, comments),
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-application', data.id] });
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });

      toast({
        title: 'Application Approved',
        description: `Application ${data.application_number} has been updated to ${data.status.replace('_', ' ')}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Approval Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export const useRejectLeaveApplication = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments: string }) =>
      updateLeaveStatus(id, 'rejected', comments), 
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-application', data.id] });

      toast({
        title: 'Application Rejected',
        description: `Application ${data.application_number} has been rejected.`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Rejection Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

// ============================================
// MUTATION HOOKS - RESUMPTION
// ============================================

/**
 * Hook to request resumption for a leave that has ended
 */
export const useRequestResumption = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      leaveService.requestResumption(applicationId),
    onSuccess: (data) => {
      toast({
        title: 'Resumption Requested',
        description: `Your resumption request for ${data.application_number} has been submitted for approval.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-leave-applications'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to request resumption.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

/**
 * Hook for director to approve resumption
 */
export const useApproveResumptionDirector = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, comments }: { applicationId: string; comments?: string }) =>
      leaveService.approveResumptionDirector(applicationId, comments),
    onSuccess: (data) => {
      toast({
        title: 'Resumption Approved',
        description: `Resumption request ${data.application_number} has been forwarded to HR for final approval.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['director-leave-applications'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve resumption.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

/**
 * Hook for HR to approve resumption (final step)
 */
export const useApproveResumptionHR = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, comments }: { applicationId: string; comments?: string }) =>
      leaveService.approveResumptionHR(applicationId, comments),
    onSuccess: (data) => {
      toast({
        title: 'Resumption Finalized',
        description: `Staff ${data.user?.full_name} has been marked as resumed.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['hr-leave-applications'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to finalize resumption.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

/**
 * Hook to reject resumption (by director or HR)
 */
export const useRejectResumption = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      applicationId, 
      comments, 
      role 
    }: { 
      applicationId: string; 
      comments?: string;
      role: 'director' | 'hr';
    }) => leaveService.rejectResumption(applicationId, comments, role),
    onSuccess: (data) => {
      toast({
        title: 'Resumption Rejected',
        description: `Resumption request ${data.application_number} has been rejected.`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject resumption.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
};