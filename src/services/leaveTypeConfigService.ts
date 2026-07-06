
// ============================================
// Leave Type Configuration Service - Fixed for 406 error
// ============================================

import { supabase } from "@/lib/supabase";
import type { LeaveTypeConfig, LeaveTypeConfigFormData, LeaveType } from "@/types/leaveType";

export const leaveTypeConfigService = {
  // Fetch all leave type configurations
  async getAllConfigs(): Promise<LeaveTypeConfig[]> {
    const { data, error } = await supabase
      .from("leave_type_config")
      .select("*")
      .order("leave_type", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Fetch single configuration by leave type
  async getConfigByType(leaveType: LeaveType): Promise<LeaveTypeConfig | null> {
    const { data, error } = await supabase
      .from("leave_type_config")
      .select("*")
      .eq("leave_type", leaveType)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid 406 when no rows

    if (error) throw new Error(error.message);
    return data;
  },

  // Create new configuration
  async createConfig(data: LeaveTypeConfigFormData): Promise<LeaveTypeConfig> {
    const { data: result, error } = await supabase
      .from("leave_type_config")
      .insert([{
        leave_type: data.leave_type,
        annual_days: data.annual_days,
        min_notice_days: data.min_notice_days,
        can_reapply: data.can_reapply,
        description: data.description,
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },

  // Update configuration - FIXED VERSION
  async updateConfig(leaveType: LeaveType, data: Partial<LeaveTypeConfigFormData>): Promise<LeaveTypeConfig> {
    // Build update object without leave_type (primary key shouldn't be updated)
    const updateData: any = {};
    if (data.annual_days !== undefined) updateData.annual_days = data.annual_days;
    if (data.min_notice_days !== undefined) updateData.min_notice_days = data.min_notice_days;
    if (data.can_reapply !== undefined) updateData.can_reapply = data.can_reapply;
    if (data.description !== undefined) updateData.description = data.description;
    
    // Don't include leave_type in update as it's the primary key
    // If you need to change leave_type, you'd need to delete and recreate

    const { data: result, error } = await supabase
      .from("leave_type_config")
      .update(updateData)
      .eq("leave_type", leaveType)
      .select()
      .maybeSingle(); // Use maybeSingle() to handle empty results gracefully

    if (error) {
      console.error("Update error:", error);
      throw new Error(error.message);
    }
    
    if (!result) {
      throw new Error(`No configuration found for leave type: ${leaveType}`);
    }
    
    return result;
  },

  // Delete configuration
  async deleteConfig(leaveType: LeaveType): Promise<void> {
    const { error } = await supabase
      .from("leave_type_config")
      .delete()
      .eq("leave_type", leaveType);

    if (error) throw new Error(error.message);
  },

  // Batch update multiple configurations
  async batchUpdateConfigs(configs: LeaveTypeConfigFormData[]): Promise<LeaveTypeConfig[]> {
    const results: LeaveTypeConfig[] = [];
    
    for (const config of configs) {
      const { data, error } = await supabase
        .from("leave_type_config")
        .upsert([{
          leave_type: config.leave_type,
          annual_days: config.annual_days,
          min_notice_days: config.min_notice_days,
          can_reapply: config.can_reapply,
          description: config.description,
        }], { onConflict: "leave_type" })
        .select()
        .single();
      
      if (error) {
        console.error("Batch update error:", error);
        throw new Error(error.message);
      }
      results.push(data);
    }
    
    return results;
  },
};