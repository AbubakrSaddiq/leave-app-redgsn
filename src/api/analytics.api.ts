// src/api/analytics.api.ts
import { supabase } from '@/lib/supabase';
import { LeaveStatus, LeaveType } from '@/types/models';

export interface DepartmentStats {
  department_id: string;
  department_name: string;
  department_code: string;
  total_staff: number;
  staff_on_leave: number;
  staff_on_leave_percentage: number;
}

export interface ActiveLeave {
  id: string;
  application_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  department_id: string;
  department_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  working_days: number;
  resumption_date: string;
  status: LeaveStatus;
}

export interface UpcomingLeave {
  id: string;
  application_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  department_id: string;
  department_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  working_days: number;
  days_until_start: number;
  status: LeaveStatus;
}

export interface LeaveTypeStats {
  leave_type: LeaveType;
  count: number;
  percentage: number;
}

export interface DepartmentLeaveStats {
  department_id: string;
  department_name: string;
  total_leaves: number;
  active_leaves: number;
  upcoming_leaves: number;
  completed_leaves: number;
}

export interface AnalyticsOverview {
  total_staff: number;
  total_on_leave: number;
  total_upcoming_leaves: number;
  total_completed_leaves: number;
  leave_type_distribution: LeaveTypeStats[];
  department_stats: DepartmentStats[];
  active_leaves: ActiveLeave[];
  upcoming_leaves: UpcomingLeave[];
  department_leave_stats: DepartmentLeaveStats[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getResumptionDate = (endDate: string): string => {
  const date = new Date(endDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

const isLeaveActive = (startDate: string, endDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  return start <= today && end >= today;
};

const isLeaveUpcoming = (startDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  return start > today;
};

const getDaysUntilStart = (startDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const diffTime = start.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = {
  /**
   * Get analytics overview for a director (department-specific)
   */
  async getDirectorAnalytics(directorId: string): Promise<AnalyticsOverview> {
    // 1. Get director's department
    const { data: director, error: directorError } = await supabase
      .from('users')
      .select('department_id')
      .eq('id', directorId)
      .single();

    if (directorError) throw directorError;
    if (!director?.department_id) {
      throw new Error('Director has no department assigned');
    }

    const departmentId = director.department_id;

    // 2. Get all staff in the department
    const { data: staff, error: staffError } = await supabase
      .from('users')
      .select('id, full_name, email, department_id')
      .eq('department_id', departmentId)
      .eq('is_active', true);

    if (staffError) throw staffError;

    const staffIds = staff?.map(s => s.id) || [];
    const totalStaff = staffIds.length;

    // 3. Get all leave applications for staff in department
    const { data: leaves, error: leavesError } = await supabase
      .from('leave_applications')
      .select(`
        *,
        user:user_id (
          id,
          full_name,
          email,
          department:department_id (
            id,
            name,
            code
          )
        )
      `)
      .in('user_id', staffIds)
      .in('status', ['approved', 'pending_director', 'pending_hr', 'pending_resumption_director', 'pending_resumption_hr']);

    if (leavesError) throw leavesError;

    // 4. Process data
    const activeLeaves: ActiveLeave[] = [];
    const upcomingLeaves: UpcomingLeave[] = [];
    const leaveTypeCount: Record<string, number> = {};

    leaves?.forEach((leave: any) => {
      const status = leave.status;
      const startDate = leave.start_date;
      const endDate = leave.end_date;
      const leaveType = leave.leave_type;

      // Count by leave type
      leaveTypeCount[leaveType] = (leaveTypeCount[leaveType] || 0) + 1;

      // Check if active (ongoing)
      if (isLeaveActive(startDate, endDate) && status === 'approved') {
        activeLeaves.push({
          id: leave.id,
          application_number: leave.application_number,
          user_id: leave.user_id,
          user_name: leave.user?.full_name || 'Unknown',
          user_email: leave.user?.email || '',
          department_id: leave.user?.department?.id || departmentId,
          department_name: leave.user?.department?.name || 'Unknown',
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          working_days: leave.working_days,
          resumption_date: getResumptionDate(endDate),
          status: status,
        });
      }

      // Check if upcoming
      if (isLeaveUpcoming(startDate) && status === 'approved') {
        upcomingLeaves.push({
          id: leave.id,
          application_number: leave.application_number,
          user_id: leave.user_id,
          user_name: leave.user?.full_name || 'Unknown',
          user_email: leave.user?.email || '',
          department_id: leave.user?.department?.id || departmentId,
          department_name: leave.user?.department?.name || 'Unknown',
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          working_days: leave.working_days,
          days_until_start: getDaysUntilStart(startDate),
          status: status,
        });
      }
    });

    const { data: directorData } = await supabase
  .from('users')
  .select(`
    department_id,
    department:departments!users_department_id_fkey (
      id,
      name,
      code
    )
  `)
  .eq('id', directorId)
  .single();

    // 5. Department stats
    const departmentStats: DepartmentStats[] = [{
      department_id: departmentId,
      department_name: directorData?.department?.name || 'Unknown',
      department_code: directorData?.department?.code || '',
      total_staff: totalStaff,
      staff_on_leave: activeLeaves.length,
      staff_on_leave_percentage: totalStaff > 0 ? (activeLeaves.length / totalStaff) * 100 : 0,
    }];

    // 6. Leave type distribution
    const leaveTypeDistribution: LeaveTypeStats[] = Object.entries(leaveTypeCount).map(([type, count]) => ({
      leave_type: type as LeaveType,
      count,
      percentage: leaves?.length > 0 ? (count / leaves.length) * 100 : 0,
    }));

    // 7. Department leave stats (only this department)
    const departmentLeaveStats: DepartmentLeaveStats[] = [{
      department_id: departmentId,
      department_name: directorData?.department?.name || 'Unknown',
      total_leaves: leaves?.length || 0,
      active_leaves: activeLeaves.length,
      upcoming_leaves: upcomingLeaves.length,
      completed_leaves: leaves?.filter(l => !isLeaveActive(l.start_date, l.end_date) && !isLeaveUpcoming(l.start_date)).length || 0,
    }];

    return {
      total_staff: totalStaff,
      total_on_leave: activeLeaves.length,
      total_upcoming_leaves: upcomingLeaves.length,
      total_completed_leaves: departmentLeaveStats[0].completed_leaves,
      leave_type_distribution: leaveTypeDistribution,
      department_stats: departmentStats,
      active_leaves: activeLeaves,
      upcoming_leaves: upcomingLeaves.sort((a, b) => a.days_until_start - b.days_until_start),
      department_leave_stats: departmentLeaveStats,
    };
  },

  /**
   * Get analytics overview for HR (organization-wide)
   */
  async getHRAnalytics(): Promise<AnalyticsOverview> {
    // 1. Get all active staff
    const { data: staff, error: staffError } = await supabase
      .from('users')
      .select('id, full_name, email, department_id')
      .eq('is_active', true);

    if (staffError) throw staffError;

    const staffIds = staff?.map(s => s.id) || [];
    const totalStaff = staffIds.length;

    // 2. Get all approved/pending leave applications
    const { data: leaves, error: leavesError } = await supabase
      .from('leave_applications')
      .select(`
        *,
        user:user_id (
          id,
          full_name,
          email,
          department:department_id (
            id,
            name,
            code
          )
        )
      `)
      .in('user_id', staffIds)
      .in('status', ['approved', 'pending_director', 'pending_hr', 'pending_resumption_director', 'pending_resumption_hr']);

    if (leavesError) throw leavesError;

    // 3. Get all departments for stats
    const { data: departments, error: deptError } = await supabase
      .from('departments')
      .select('id, name, code')
      .order('name');

    if (deptError) throw deptError;

    // 4. Process data
    const activeLeaves: ActiveLeave[] = [];
    const upcomingLeaves: UpcomingLeave[] = [];
    const leaveTypeCount: Record<string, number> = {};
    const deptActiveCount: Record<string, number> = {};
    const deptStaffCount: Record<string, number> = {};
    const deptLeaveCount: Record<string, number> = {};

    // Initialize department counts
    departments?.forEach((dept: any) => {
      deptStaffCount[dept.id] = 0;
      deptActiveCount[dept.id] = 0;
      deptLeaveCount[dept.id] = 0;
    });

    // Count staff per department
    staff?.forEach((s: any) => {
      if (s.department_id) {
        deptStaffCount[s.department_id] = (deptStaffCount[s.department_id] || 0) + 1;
      }
    });

    // Process leaves
    leaves?.forEach((leave: any) => {
      const status = leave.status;
      const startDate = leave.start_date;
      const endDate = leave.end_date;
      const leaveType = leave.leave_type;
      const deptId = leave.user?.department?.id;

      // Count by leave type
      leaveTypeCount[leaveType] = (leaveTypeCount[leaveType] || 0) + 1;

      // Count by department
      if (deptId) {
        deptLeaveCount[deptId] = (deptLeaveCount[deptId] || 0) + 1;
      }

      // Check if active (ongoing)
      if (isLeaveActive(startDate, endDate) && status === 'approved') {
        if (deptId) {
          deptActiveCount[deptId] = (deptActiveCount[deptId] || 0) + 1;
        }

        activeLeaves.push({
          id: leave.id,
          application_number: leave.application_number,
          user_id: leave.user_id,
          user_name: leave.user?.full_name || 'Unknown',
          user_email: leave.user?.email || '',
          department_id: deptId || '',
          department_name: leave.user?.department?.name || 'Unknown',
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          working_days: leave.working_days,
          resumption_date: getResumptionDate(endDate),
          status: status,
        });
      }

      // Check if upcoming
      if (isLeaveUpcoming(startDate) && status === 'approved') {
        upcomingLeaves.push({
          id: leave.id,
          application_number: leave.application_number,
          user_id: leave.user_id,
          user_name: leave.user?.full_name || 'Unknown',
          user_email: leave.user?.email || '',
          department_id: deptId || '',
          department_name: leave.user?.department?.name || 'Unknown',
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          working_days: leave.working_days,
          days_until_start: getDaysUntilStart(startDate),
          status: status,
        });
      }
    });

    // 5. Department stats
    const departmentStats: DepartmentStats[] = departments?.map((dept: any) => ({
      department_id: dept.id,
      department_name: dept.name,
      department_code: dept.code,
      total_staff: deptStaffCount[dept.id] || 0,
      staff_on_leave: deptActiveCount[dept.id] || 0,
      staff_on_leave_percentage: deptStaffCount[dept.id] > 0 
        ? ((deptActiveCount[dept.id] || 0) / deptStaffCount[dept.id]) * 100 
        : 0,
    })) || [];

    // 6. Leave type distribution
    const leaveTypeDistribution: LeaveTypeStats[] = Object.entries(leaveTypeCount).map(([type, count]) => ({
      leave_type: type as LeaveType,
      count,
      percentage: leaves?.length > 0 ? (count / leaves.length) * 100 : 0,
    }));

    // 7. Department leave stats
    const departmentLeaveStats: DepartmentLeaveStats[] = departments?.map((dept: any) => {
      const deptLeaves = leaves?.filter((l: any) => l.user?.department?.id === dept.id) || [];
      const deptActive = deptLeaves.filter((l: any) => isLeaveActive(l.start_date, l.end_date) && l.status === 'approved');
      const deptUpcoming = deptLeaves.filter((l: any) => isLeaveUpcoming(l.start_date) && l.status === 'approved');
      
      return {
        department_id: dept.id,
        department_name: dept.name,
        total_leaves: deptLeaves.length,
        active_leaves: deptActive.length,
        upcoming_leaves: deptUpcoming.length,
        completed_leaves: deptLeaves.filter((l: any) => 
          !isLeaveActive(l.start_date, l.end_date) && 
          !isLeaveUpcoming(l.start_date) && 
          l.status === 'approved'
        ).length,
      };
    }) || [];

    return {
      total_staff: totalStaff,
      total_on_leave: activeLeaves.length,
      total_upcoming_leaves: upcomingLeaves.length,
      total_completed_leaves: leaves?.filter(l => 
        !isLeaveActive(l.start_date, l.end_date) && 
        !isLeaveUpcoming(l.start_date) && 
        l.status === 'approved'
      ).length || 0,
      leave_type_distribution: leaveTypeDistribution,
      department_stats: departmentStats,
      active_leaves: activeLeaves,
      upcoming_leaves: upcomingLeaves.sort((a, b) => a.days_until_start - b.days_until_start),
      department_leave_stats: departmentLeaveStats,
    };
  },
};