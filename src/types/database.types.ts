// ============================================
// Database Types - Complete Supabase Schema
// This file defines the database schema types
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      approval_history: {
        Row: {
          action: string
          approver_id: string | null
          approver_role: Database["public"]["Enums"]["user_role"]
          comments: string | null
          created_at: string | null
          id: string
          leave_application_id: string | null
        }
        Insert: {
          action: string
          approver_id?: string | null
          approver_role: Database["public"]["Enums"]["user_role"]
          comments?: string | null
          created_at?: string | null
          id?: string
          leave_application_id?: string | null
        }
        Update: {
          action?: string
          approver_id?: string | null
          approver_role?: Database["public"]["Enums"]["user_role"]
          comments?: string | null
          created_at?: string | null
          id?: string
          leave_application_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_history_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_history_leave_application_id_fkey"
            columns: ["leave_application_id"]
            isOneToOne: false
            referencedRelation: "leave_applications"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string | null
          director_id: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          director_id?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          director_id?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_department_director"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      designations: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      desired_leave_months: {
        Row: {
          created_at: string
          id: string
          is_locked: boolean
          preferred_months: number[]
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_locked?: boolean
          preferred_months?: number[]
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_locked?: boolean
          preferred_months?: number[]
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "desired_leave_months_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leave_applications: {
        Row: {
          application_number: string
          created_at: string | null
          director_approved_at: string | null
          director_approved_by: string | null
          director_comments: string | null
          director_id: string | null
          end_date: string
          hr_approved_at: string | null
          hr_approved_by: string | null
          hr_comments: string | null
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string | null
          resumption_director_approved_at: string | null
          resumption_director_approved_by: string | null
          resumption_director_comments: string | null
          resumption_hr_approved_at: string | null
          resumption_hr_approved_by: string | null
          resumption_hr_comments: string | null
          resumption_requested_at: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          study_program: Database["public"]["Enums"]["study_program"] | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
          working_days: number
        }
        Insert: {
          application_number: string
          created_at?: string | null
          director_approved_at?: string | null
          director_approved_by?: string | null
          director_comments?: string | null
          director_id?: string | null
          end_date: string
          hr_approved_at?: string | null
          hr_approved_by?: string | null
          hr_comments?: string | null
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          resumption_director_approved_at?: string | null
          resumption_director_approved_by?: string | null
          resumption_director_comments?: string | null
          resumption_hr_approved_at?: string | null
          resumption_hr_approved_by?: string | null
          resumption_hr_comments?: string | null
          resumption_requested_at?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          study_program?: Database["public"]["Enums"]["study_program"] | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          working_days: number
        }
        Update: {
          application_number?: string
          created_at?: string | null
          director_approved_at?: string | null
          director_approved_by?: string | null
          director_comments?: string | null
          director_id?: string | null
          end_date?: string
          hr_approved_at?: string | null
          hr_approved_by?: string | null
          hr_comments?: string | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          resumption_director_approved_at?: string | null
          resumption_director_approved_by?: string | null
          resumption_director_comments?: string | null
          resumption_hr_approved_at?: string | null
          resumption_hr_approved_by?: string | null
          resumption_hr_comments?: string | null
          resumption_requested_at?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          study_program?: Database["public"]["Enums"]["study_program"] | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          working_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_director_approved_by_fkey"
            columns: ["director_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_director_id_fkey"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_resumption_director_approved_by_fkey"
            columns: ["resumption_director_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_resumption_hr_approved_by_fkey"
            columns: ["resumption_hr_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leave_balances: {
        Row: {
          allocated_days: number
          available_days: number | null
          created_at: string | null
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          pending_days: number | null
          updated_at: string | null
          used_days: number | null
          user_id: string | null
          year: number
        }
        Insert: {
          allocated_days?: number
          available_days?: number | null
          created_at?: string | null
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          pending_days?: number | null
          updated_at?: string | null
          used_days?: number | null
          user_id?: string | null
          year: number
        }
        Update: {
          allocated_days?: number
          available_days?: number | null
          created_at?: string | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          pending_days?: number | null
          updated_at?: string | null
          used_days?: number | null
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leave_type_config: {
        Row: {
          annual_days: number
          can_reapply: boolean | null
          created_at: string | null
          description: string | null
          leave_type: Database["public"]["Enums"]["leave_type"]
          min_notice_days: number
        }
        Insert: {
          annual_days: number
          can_reapply?: boolean | null
          created_at?: string | null
          description?: string | null
          leave_type: Database["public"]["Enums"]["leave_type"]
          min_notice_days?: number
        }
        Update: {
          annual_days?: number
          can_reapply?: boolean | null
          created_at?: string | null
          description?: string | null
          leave_type?: Database["public"]["Enums"]["leave_type"]
          min_notice_days?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          email_sent: boolean | null
          id: string
          is_read: boolean | null
          message: string
          related_leave_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          message: string
          related_leave_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_leave_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_leave_id_fkey"
            columns: ["related_leave_id"]
            isOneToOne: false
            referencedRelation: "leave_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      public_holidays: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          id: string
          is_active: boolean | null
          is_recurring: boolean | null
          name: string
          source: string | null
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          name: string
          source?: string | null
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          name?: string
          source?: string | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_holidays_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string | null
          department_id: string | null
          designation_id: string | null
          email: string
          expires_at: string | null
          full_name: string
          id: string
          invited_by: string | null
          is_used: boolean | null
          role: string
          temp_password: string
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          designation_id?: string | null
          email: string
          expires_at?: string | null
          full_name: string
          id?: string
          invited_by?: string | null
          is_used?: boolean | null
          role: string
          temp_password: string
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          designation_id?: string | null
          email?: string
          expires_at?: string | null
          full_name?: string
          id?: string
          invited_by?: string | null
          is_used?: boolean | null
          role?: string
          temp_password?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "designations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department_id: string | null
          designation_id: string | null
          email: string
          full_name: string
          has_submitted_desired_months: boolean | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department_id?: string | null
          designation_id?: string | null
          email: string
          full_name: string
          has_submitted_desired_months?: boolean | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department_id?: string | null
          designation_id?: string | null
          email?: string
          full_name?: string
          has_submitted_desired_months?: boolean | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "designations"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      view_eligible_resumption_leaves: {
        Row: {
          applicant_email: string | null
          applicant_name: string | null
          application_number: string | null
          created_at: string | null
          department_name: string | null
          director_approved_at: string | null
          director_approved_by: string | null
          director_comments: string | null
          director_id: string | null
          end_date: string | null
          hr_approved_at: string | null
          hr_approved_by: string | null
          hr_comments: string | null
          id: string | null
          leave_type: Database["public"]["Enums"]["leave_type"] | null
          reason: string | null
          resumption_director_approved_at: string | null
          resumption_director_approved_by: string | null
          resumption_director_comments: string | null
          resumption_hr_approved_at: string | null
          resumption_hr_approved_by: string | null
          resumption_hr_comments: string | null
          resumption_requested_at: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["leave_status"] | null
          study_program: Database["public"]["Enums"]["study_program"] | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
          working_days: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_director_approved_by_fkey"
            columns: ["director_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_director_id_fkey"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_resumption_director_approved_by_fkey"
            columns: ["resumption_director_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_resumption_hr_approved_by_fkey"
            columns: ["resumption_hr_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      view_pending_resumption_requests: {
        Row: {
          applicant_email: string | null
          applicant_name: string | null
          application_number: string | null
          approval_stage: string | null
          created_at: string | null
          department_name: string | null
          director_approved_at: string | null
          director_approved_by: string | null
          director_comments: string | null
          director_id: string | null
          end_date: string | null
          hr_approved_at: string | null
          hr_approved_by: string | null
          hr_comments: string | null
          id: string | null
          leave_type: Database["public"]["Enums"]["leave_type"] | null
          reason: string | null
          resumption_director_approved_at: string | null
          resumption_director_approved_by: string | null
          resumption_director_comments: string | null
          resumption_hr_approved_at: string | null
          resumption_hr_approved_by: string | null
          resumption_hr_comments: string | null
          resumption_requested_at: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["leave_status"] | null
          study_program: Database["public"]["Enums"]["study_program"] | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
          working_days: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_director_approved_by_fkey"
            columns: ["director_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_director_id_fkey"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_hr_approved_by_fkey"
            columns: ["hr_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_resumption_director_approved_by_fkey"
            columns: ["resumption_director_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_resumption_hr_approved_by_fkey"
            columns: ["resumption_hr_approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      admin_setup_user_profile: {
        Args: {
          p_department_id?: string
          p_designation_id?: string
          p_full_name: string
          p_role: string
          p_target_user_id: string
        }
        Returns: undefined
      }
      allocate_leave_for_all_users: {
        Args: { p_year?: number }
        Returns: {
          user_count: number
          year: number
        }[]
      }
      allocate_leave_for_user: {
        Args: {  p_user_id: string; p_year: number }
        Returns: undefined
      }
      calculate_study_leave_end_date: {
        Args: {
          p_program: Database["public"]["Enums"]["study_program"]
          p_start_date: string
        }
        Returns: string
      }
      calculate_working_days: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: number
      }
      check_leave_availability: {
        Args: {
          p_leave_type: Database["public"]["Enums"]["leave_type"]
          p_user_id: string
          p_working_days: number
          p_year: number
        }
        Returns: {
          available_days: number
          is_available: boolean
          message: string
        }[]
      }
      check_leave_dates_in_desired_months: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string }
        Returns: {
          desired_months: number[]
          is_valid: boolean
          leave_months: number[]
          message: string
        }[]
      }
      check_minimum_notice: {
        Args: {
          p_leave_type: Database["public"]["Enums"]["leave_type"]
          p_start_date: string
        }
        Returns: {
          is_valid: boolean
          message: string
          provided_days: number
          required_days: number
        }[]
      }
      check_overlapping_leave: {
        Args: {
          p_end_date: string
          p_exclude_application_id?: string
          p_start_date: string
          p_user_id: string
        }
        Returns: {
          conflicting_application_id: string
          has_overlap: boolean
          message: string
        }[]
      }
      determine_approval_workflow: {
        Args: {
          p_user_id: string
          p_user_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: {
          director_id: string
          initial_status: Database["public"]["Enums"]["leave_status"]
          needs_director_approval: boolean
          needs_hr_approval: boolean
        }[]
      }
      get_department_director: {
        Args: { p_department_id: string }
        Returns: string
      }
      get_holiday_stats: {
        Args: never
        Returns: {
          active: number
          inactive: number
          recurring: number
          this_year: number
          total: number
        }[]
      }
      get_holidays_by_year: {
        Args: { year_param: number }
        Returns: {
          created_at: string
          date: string
          description: string
          id: string
          is_active: boolean
          is_recurring: boolean
          name: string
          source: string
          year: number
        }[]
      }
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_upcoming_holidays: {
        Args: { days_ahead?: number }
        Returns: {
          date: string
          days_until: number
          description: string
          id: string
          name: string
        }[]
      }
      get_user_role: {
        Args: { p_user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: { p_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      is_department_director: {
        Args: { p_department_id: string; p_user_id: string }
        Returns: boolean
      }
      is_director_of_department: {
        Args: { p_department_id: string }
        Returns: boolean
      }
      is_public_holiday: { Args: { check_date: string }; Returns: boolean }
      validate_leave_application: {
        Args: {
          p_end_date: string
          p_exclude_application_id?: string
          p_leave_type: Database["public"]["Enums"]["leave_type"]
          p_start_date: string
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      leave_status:
        | "draft"
        | "pending_director"
        | "pending_hr"
        | "approved"
        | "rejected"
        | "pending_resumption_director"
        | "pending_resumption_hr"
        | "resumed"
      leave_type:
        | "annual"
        | "casual"
        | "sick"
        | "maternity"
        | "paternity"
        | "study"
      study_program: "bsc" | "msc" | "phd"
      user_role: "staff" | "director" | "hr" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ============================================
// Helper Types for Supabase Queries
// ============================================

export type Tables<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Row']

export type TablesInsert<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Insert']

export type TablesUpdate<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Update']

export type Enums<EnumName extends keyof Database['public']['Enums']> = 
  Database['public']['Enums'][EnumName]

export type Functions<
  FunctionName extends keyof Database['public']['Functions']
> = Database['public']['Functions'][FunctionName]

export default Database