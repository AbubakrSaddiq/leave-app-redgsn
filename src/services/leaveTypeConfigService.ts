
// ============================================
// Leave Type Configuration Service
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
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data;
  },

  // Create new configuration
  async createConfig(data: LeaveTypeConfigFormData): Promise<LeaveTypeConfig> {
    const { data: result, error } = await supabase
      .from("leave_type_config")
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },

  // Update configuration
  async updateConfig(leaveType: LeaveType, data: Partial<LeaveTypeConfigFormData>): Promise<LeaveTypeConfig> {
    const { data: result, error } = await supabase
      .from("leave_type_config")
      .update(data)
      .eq("leave_type", leaveType)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  },

  // Delete configuration (use with caution - only for unused leave types)
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
        .upsert([config], { onConflict: "leave_type" })
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      results.push(data);
    }
    
    return results;
  },
};