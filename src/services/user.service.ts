
// ============================================
// User Management Service - All Supabase operations
// ============================================

import { supabase } from "@/lib/supabase";
import type { User, Department, Designation, UserFormData, UserFilters } from "@/types/user";

export const userService = {
  // Fetch all users with filters
  async getUsers(filters?: UserFilters): Promise<User[]> {
    let query = supabase
      .from("users")
      .select("*")
      .order("full_name", { ascending: true });

    if (filters?.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    if (filters?.role) {
      query = query.eq("role", filters.role);
    }

    if (filters?.status === "active") {
      query = query.eq("is_active", true);
    } else if (filters?.status === "inactive") {
      query = query.eq("is_active", false);
    }

    if (filters?.department_id) {
      query = query.eq("department_id", filters.department_id);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Get single user by ID
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Create new user
  async createUser(userData: UserFormData): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Update existing user
  async updateUser(id: string, userData: Partial<UserFormData>): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // Toggle user active status
  async toggleUserStatus(id: string, currentStatus: boolean): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update({ is_active: !currentStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Fetch all departments
  async getDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
      .from("departments")
      .select("id, name, code")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Fetch all designations
  async getDesignations(): Promise<Designation[]> {
    const { data, error } = await supabase
      .from("designations")
      .select("id, name, code")
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },
};