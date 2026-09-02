import { supabase } from "@/lib/supabase";
import { LeaveApplication, LeaveStatus } from "@/types/models";

export const leaveService = {
  /**
   * Fetches public holidays for a specific year
   */
  async getHolidays(year: number): Promise<Set<string>> {
    const { data: holidays } = await supabase
      .from("public_holidays")
      .select("date")
      .eq("year", year)
      .eq("is_active", true);

    return new Set(holidays?.map((h) => h.date) || []);
  },

  /**
   * Calculates the end date based on working days, skipping weekends and holidays
   */
  async calculateEndDate(startDate: string, workingDays: number): Promise<string> {
    if (!startDate || workingDays <= 0) return "";

    const holidayDates = await this.getHolidays(new Date(startDate).getFullYear());
    let currentDate = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < workingDays) {
      const dayOfWeek = currentDate.getDay();
      const dateString = currentDate.toISOString().split("T")[0];

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateString)) {
        daysAdded++;
      }

      if (daysAdded < workingDays) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return currentDate.toISOString().split("T")[0];
  },

  /**
   * Calculates the resumption date (next business day)
   */
  async calculateResumptionDate(endDate: string): Promise<string> {
    if (!endDate) return "";
    const holidayDates = await this.getHolidays(new Date(endDate).getFullYear());
    let resumptionDate = new Date(endDate);
    resumptionDate.setDate(resumptionDate.getDate() + 1);

    while (true) {
      const dayOfWeek = resumptionDate.getDay();
      const dateString = resumptionDate.toISOString().split("T")[0];

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateString)) {
        break;
      }
      resumptionDate.setDate(resumptionDate.getDate() + 1);
    }
    return resumptionDate.toISOString().split("T")[0];
  },

  // ============================================
  // RESUMPTION SERVICE METHODS
  // ============================================

  /**
   * Request resumption for an approved leave that ended
   */
  async requestResumption(applicationId: string): Promise<LeaveApplication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('leave_applications')
      .update({
        status: 'pending_resumption_director',
        resumption_requested_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .eq('user_id', user.id)
      .select(`
        *,
        user:users!leave_applications_user_id_fkey (
          id,
          full_name,
          email,
          department:departments!users_department_id_fkey (
            id,
            name,
            code
          )
        )
      `)
      .single();

    if (error) throw error;
    return data as LeaveApplication;
  },

  /**
   * Director approves resumption
   */
  async approveResumptionDirector(applicationId: string, comments?: string): Promise<LeaveApplication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('leave_applications')
      .update({
        status: 'pending_resumption_hr',
        resumption_director_approved_at: new Date().toISOString(),
        resumption_director_approved_by: user.id,
        resumption_director_comments: comments || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
    .select(`
      *,
      user:users!leave_applications_user_id_fkey (
        id,
        full_name,
        email,
        department:departments!users_department_id_fkey (
          id,
          name,
          code
        )
      )
    `)
      .single();

    if (error) throw error;
    return data as any as LeaveApplication;
  },

  /**
   * HR approves resumption (final step)
   */
  async approveResumptionHR(applicationId: string, comments?: string): Promise<LeaveApplication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('leave_applications')
      .update({
        status: 'resumed',
        resumption_hr_approved_at: new Date().toISOString(),
        resumption_hr_approved_by: user.id,
        resumption_hr_comments: comments || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
     .select(`
  *,
  user:users!leave_applications_user_id_fkey (
    id,
    full_name,
    email,
    department:departments!users_department_id_fkey (
      id,
      name,
      code
    )
  )
`)
      .single();

    if (error) throw error;
    return data as any as LeaveApplication;
  },

  /**
   * Reject resumption (by director or HR)
   */
  async rejectResumption(applicationId: string, comments?: string, role?: 'director' | 'hr'): Promise<LeaveApplication> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updateData: any = {
      status: 'approved',
      updated_at: new Date().toISOString(),
    };

    if (role === 'director') {
      updateData.resumption_director_comments = comments || null;
      updateData.resumption_director_approved_at = null;
      updateData.resumption_director_approved_by = null;
    } else if (role === 'hr') {
      updateData.resumption_hr_comments = comments || null;
      updateData.resumption_hr_approved_at = null;
      updateData.resumption_hr_approved_by = null;
    }

    const { data, error } = await supabase
      .from('leave_applications')
      .update(updateData)
      .eq('id', applicationId)
     .select(`
  *,
  user:users!leave_applications_user_id_fkey (
    id,
    full_name,
    email,
    department:departments!users_department_id_fkey (
      id,
      name,
      code
    )
  )
`)
      .single();

    if (error) throw error;
    return data as any as LeaveApplication;
  },
};