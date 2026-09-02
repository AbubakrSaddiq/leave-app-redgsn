// ============================================
// Data Models - Type Definitions
// Clean version with no external dependencies
// ============================================

// ============================================
// ENUMS
// ============================================

export enum UserRole {
  STAFF = 'staff',
  DIRECTOR = 'director',
  HR = 'hr',
  ADMIN = 'admin',
}

export enum LeaveType {
  ANNUAL = 'annual',
  CASUAL = 'casual',
  SICK = 'sick',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
  STUDY = 'study',
}

export enum LeaveStatus {
  DRAFT = 'draft',
  PENDING_DIRECTOR = 'pending_director',
  PENDING_HR = 'pending_hr',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING_RESUMPTION_DIRECTOR = 'pending_resumption_director',
  PENDING_RESUMPTION_HR = 'pending_resumption_hr',
  RESUMED = 'resumed',
}

export enum NotificationType {
  LEAVE_SUBMITTED = 'leave_submitted',
  LEAVE_PENDING_DIRECTOR = 'leave_pending_director',
  LEAVE_PENDING_HR = 'leave_pending_hr',
  LEAVE_APPROVED = 'leave_approved',
  LEAVE_REJECTED = 'leave_rejected',
  BALANCE_LOW = 'balance_low',
  RESUMPTION_PENDING_DIRECTOR = 'resumption_pending_director',
  RESUMPTION_PENDING_HR = 'resumption_pending_hr',
  RESUMPTION_APPROVED = 'resumption_approved',
  RESUMPTION_REJECTED = 'resumption_rejected',
}

export enum StudyProgram {
  BSC = 'bsc',
  MSC = 'msc',
  PHD = 'phd',
}

// ============================================
// DATABASE MODELS - With nullable fields to match DB
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id: string | null;
  designation_id?: string | null;

  is_active: boolean | null; // MADE NULLABLE - DB has null
  avatar_url: string | null;
  has_submitted_desired_months?: boolean | null;
  created_at: string;
  updated_at: string;
  department?: Department;
  designation?: Designation;
}

export interface Designation {
  id: string;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  director_id: string | null;
  created_at: string;
  updated_at: string;
  director?: User;
}

export interface LeaveTypeConfig {
  leave_type: LeaveType;
  annual_days: number;
  min_notice_days: number;
  can_reapply: boolean | null; // MADE NULLABLE - DB has null
  description: string | null;
  created_at: string | null;
}

export interface LeaveBalance {
  id: string;
  user_id: string | null; // MADE NULLABLE
  leave_type: LeaveType;
  year: number;
  allocated_days: number;
  used_days: number | null; // MADE NULLABLE
  pending_days: number | null; // MADE NULLABLE
  available_days: number | null; // MADE NULLABLE
  created_at: string | null;
  updated_at: string | null;
  user?: User;
}

export interface LeaveApplication {
  id: string;
  application_number: string;
  user_id: string | null; // MADE NULLABLE
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  working_days: number;
  status: LeaveStatus | null; // MADE NULLABLE
  reason: string | null;
  submitted_at: string | null;
  director_id: string | null;
  director_approved_by: string | null;
  director_approved_at: string | null;
  director_comments: string | null;
  hr_approved_by: string | null;
  hr_approved_at: string | null;
  hr_comments: string | null;
  created_at: string | null;
  updated_at: string | null;
  user?: User | null;
  director?: User | null;
  study_program?: StudyProgram | null;
  resumption_requested_at?: string | null;
  resumption_director_approved_at?: string | null;
  resumption_director_comments?: string | null;
  resumption_director_approved_by?: string | null;
  resumption_hr_approved_at?: string | null;
  resumption_hr_comments?: string | null;
  resumption_hr_approved_by?: string | null;
}

export interface PublicHoliday {
  id: string;
  date: string;
  name: string;
  year: number;
  is_active: boolean | null; // MADE NULLABLE
  source: string | null;
  created_at: string | null;
}

export interface Notification {
  id: string;
  user_id: string | null;
  type: string;
  title: string;
  message: string;
  related_leave_id: string | null;
  is_read: boolean | null;
  email_sent: boolean | null;
  created_at: string | null;
}

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface CreateLeaveApplicationDto {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  working_days: number;
  study_program?: StudyProgram;
}

export interface ApprovalActionDto {
  comments?: string;
}

export interface LeaveApplicationValidationResult {
  is_valid: boolean;
  working_days: number;
  validations: {
    sufficient_balance: {
      valid: boolean;
      available_days: number;
      required_days: number;
      message?: string;
    };
    no_overlap: {
      valid: boolean;
      conflicting_application_id?: string;
      message?: string;
    };
    minimum_notice: {
      valid: boolean;
      required_days: number;
      provided_days: number;
      message?: string;
    };
  };
  warnings?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ============================================
// Profile Type (for Auth)
// ============================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department_id: string | null;
  designation_id: string | null;
  is_active: boolean | null;
  avatar_url: string | null;
  has_submitted_desired_months: boolean | null;
  created_at: string;
  updated_at: string;
  department?: Department;
  designation?: Designation;
}