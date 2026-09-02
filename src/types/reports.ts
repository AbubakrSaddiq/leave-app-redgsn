// src/types/reports.ts
export interface LeaveReportData {
  id: string;
  application_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  working_days: number;
  status: string;
  reason: string;
  submitted_at: string | null;
  department_name: string;
  department_code: string;
  director_approved_at?: string | null;
  director_comments?: string | null;
  hr_approved_at?: string | null;
  hr_comments?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any; // Allow any other properties
}