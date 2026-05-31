
// ============================================
// User Management Hooks
// ============================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { userService } from "@/services/user.service";
import type { User, Department, Designation, UserFilters } from "@/types/user";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({ search: "" });
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers(filters);
      setUsers(data);
    } catch (error: any) {
      toast({
        title: "Error loading users",
        description: error.message,
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async (userData: any) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers(prev => [newUser, ...prev]);
      toast({
        title: "User created",
        description: `${userData.full_name} has been added`,
        status: "success",
        duration: 3000,
      });
      return newUser;
    } catch (error: any) {
      toast({
        title: "Creation failed",
        description: error.message,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  const updateUser = useCallback(async (id: string, userData: any) => {
    try {
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      toast({
        title: "User updated",
        description: "Profile has been updated successfully",
        status: "success",
        duration: 3000,
      });
      return updatedUser;
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  const deleteUser = useCallback(async (id: string, userName: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast({
        title: "User deleted",
        description: `${userName} has been removed`,
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  const toggleStatus = useCallback(async (id: string, currentStatus: boolean, userName: string) => {
    try {
      const updatedUser = await userService.toggleUserStatus(id, currentStatus);
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      toast({
        title: currentStatus ? "User deactivated" : "User activated",
        description: `${userName} has been ${currentStatus ? "deactivated" : "activated"}`,
        status: "success",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message,
        status: "error",
        duration: 4000,
      });
      throw error;
    }
  }, [toast]);

  const filteredUsers = useMemo(() => {
    if (!filters.search) return users;
    const searchLower = filters.search.toLowerCase();
    return users.filter(
      u =>
        u.full_name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
    );
  }, [users, filters.search]);

  return {
    users: filteredUsers,
    allUsers: users,
    loading,
    filters,
    setFilters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
  };
};

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await userService.getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { departments, loading };
};

export const useDesignations = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await userService.getDesignations();
        setDesignations(data);
      } catch (error) {
        console.error("Failed to load designations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { designations, loading };
};