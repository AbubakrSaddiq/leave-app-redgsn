// File: src/hooks/useUserMutations.ts
// ============================================
// User Mutations Hook - Separated from UI
// ============================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  role: string;
  department_id: string | null;
  designation_id: string | null;
}

interface UpdateUserData {
  id: string;
  data: {
    full_name: string;
    role: string;
    department_id: string | null;
    designation_id: string | null;
  };
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("No active session — please log out and log back in");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create user");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateUserData) => {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: data.full_name,
          role: data.role as any,
          department_id: data.department_id,
          designation_id: data.designation_id,
        })
        .eq("id", id);

      if (updateError) throw new Error(updateError.message);

      // Fetch the updated user
      const {data:updatedUser, error: fetchError} = await supabase
        .from("users")
        .select(`*, departments(*), designations(*)`)
        .eq("id", id)
        .single();

        if (fetchError){
          // if fetch fails, still return partial data so update inst lost
          console.warn("Failed to fetch updated user:", fetchError);
      return { id, ...data };

        }

        return updatedUser;
    },
    onSuccess: (updatedUser, variables) => {
      // Invalidate the users list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Update individual user cache
      if (updatedUser && updatedUser.id) {
        queryClient.setQueryData(["user", variables.id], updatedUser);
      }

      // If updating the current logged-in user, refresh profile
      const currentUser = queryClient.getQueryData<any>(["current-profile"]);
      if (currentUser?.id === variables.id) {
        queryClient.invalidateQueries({ queryKey: ["current-profile"] });
      }
    },
  });
};