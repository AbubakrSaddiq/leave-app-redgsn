// File: src/types/leaveType.ts
// ============================================
// Leave Type Configuration Types
// ============================================

export type LeaveType = 
  | 'annual' 
  | 'casual' 
  | 'sick' 
  | 'maternity' 
  | 'paternity' 
  | 'study';

export interface LeaveTypeConfig {
  leave_type: LeaveType;
  annual_days: number;
  min_notice_days: number;
  can_reapply: boolean;
  description: string | null;
  created_at: string;
}

export interface LeaveTypeConfigFormData {
  leave_type: LeaveType;
  annual_days: number;
  min_notice_days: number;
  can_reapply: boolean;
  description: string | null;
}

// Display-friendly leave type labels
export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: 'Annual Leave',
  casual: 'Casual Leave',
  sick: 'Sick Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  study: 'Study Leave',
};

// Display-friendly leave type descriptions
export const LEAVE_TYPE_DESCRIPTIONS: Record<LeaveType, string> = {
  annual: 'Standard annual vacation leave for all staff members',
  casual: 'Short-term leave for personal or family matters',
  sick: 'Medical leave for illness or health-related issues',
  maternity: 'Maternity leave for expecting mothers',
  paternity: 'Paternity leave for new fathers',
  study: 'Educational leave for academic pursuits',
};

// Default configurations for new leave types
export const DEFAULT_LEAVE_CONFIG: Omit<LeaveTypeConfigFormData, 'leave_type'> = {
  annual_days: 0,
  min_notice_days: 0,
  can_reapply: false,
  description: '',
};