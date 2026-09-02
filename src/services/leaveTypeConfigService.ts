// ============================================
// Leave Type Configuration Service - FIXED
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
    return (data || []) as any as LeaveTypeConfig[];
  },

  // Fetch single configuration by leave type
  async getConfigByType(leaveType: LeaveType): Promise<LeaveTypeConfig | null> {
    const { data, error } = await supabase
      .from("leave_type_config")
      .select("*")
      .eq("leave_type", leaveType)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as any as LeaveTypeConfig | null;
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
    return result as any as LeaveTypeConfig;
  },

  // Update configuration - FIXED VERSION
  async updateConfig(leaveType: LeaveType, data: Partial<LeaveTypeConfigFormData>): Promise<LeaveTypeConfig> {
    // First, check if the configuration exists
    const existingConfig = await this.getConfigByType(leaveType);
    
    // If it doesn't exist, create it instead
    if (!existingConfig) {
      console.log(`Config for ${leaveType} not found, creating new one...`);
      const fullData: LeaveTypeConfigFormData = {
        leave_type: leaveType,
        annual_days: data.annual_days ?? 0,
        min_notice_days: data.min_notice_days ?? 0,
        can_reapply: data.can_reapply ?? false,
        description: data.description ?? null,
      };
      return this.createConfig(fullData);
    }

    // Build update object
    const updateData: any = {};
    if (data.annual_days !== undefined) updateData.annual_days = data.annual_days;
    if (data.min_notice_days !== undefined) updateData.min_notice_days = data.min_notice_days;
    if (data.can_reapply !== undefined) updateData.can_reapply = data.can_reapply;
    if (data.description !== undefined) updateData.description = data.description;
    
    // Remove any undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // If no fields to update, return existing config
    if (Object.keys(updateData).length === 0) {
      return existingConfig;
    }

    // Perform the update
    const { error } = await supabase
      .from("leave_type_config")
      .update(updateData)
      .eq("leave_type", leaveType);

    if (error) {
      console.error("Update error:", error);
      throw new Error(error.message);
    }

    // Fetch the updated record
    const updatedConfig = await this.getConfigByType(leaveType);
    
    if (!updatedConfig) {
      throw new Error(`Failed to fetch updated configuration for ${leaveType}`);
    }

    return updatedConfig;
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
      const result = await this.updateConfig(config.leave_type, config);
      results.push(result);
    }
    
    return results;
  },
};