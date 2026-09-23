// supabase/functions/admin-create-user/index.ts
// ============================================
// Admin Create User Edge Function
// - Creates auth user
// - Ensures public.users profile exists
// - Allocates leave balances
// ============================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    // ── 1. Auth header check ─────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or malformed Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // ── 2. Service client for verifying caller & creating users ──────────
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const {
      data: { user },
      error: userError,
    } = await serviceClient.auth.getUser(token);

    console.log("Auth user:", user?.id, "Error:", userError?.message);

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Invalid or expired token",
          detail: userError?.message,
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── 3. Verify caller is admin or HR ─────────────────────────────────
    const { data: callerProfile, error: profileError } = await serviceClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    console.log(
      "Caller profile:",
      callerProfile,
      "Error:",
      profileError?.message,
    );

    if (!callerProfile) {
      return new Response(
        JSON.stringify({
          error: "Your profile was not found in public.users",
          detail: profileError?.message ?? "No row returned",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const allowedRoles = ["admin", "hr"];
    if (!allowedRoles.includes(callerProfile.role)) {
      return new Response(
        JSON.stringify({
          error: "Forbidden: admin or hr role required",
          your_role: callerProfile.role,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── 4. Parse & validate request body ────────────────────────────────
    const {
      email,
      password,
      full_name,
      role = "staff",
      department_id = null,
      designation_id = null,
    } = await req.json();

    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({
          error: "email, password, and full_name are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const validRoles = ["staff", "director", "hr", "admin"];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: `Invalid role: ${role}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ── 5. Create auth user ─────────────────────────────────────────────
    const { data: newAuthUser, error: createError } =
      await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          role,
          department_id,
          designation_id,
        },
      });

    console.log(
      "Created auth user:",
      newAuthUser?.user?.id,
      "Error:",
      createError?.message,
    );

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const newUserId = newAuthUser.user!.id;

    // ── 6. Wait briefly for the trigger to populate public.users ────────
    // Retry loop: check for profile existence up to 5 times, ~500ms apart
    let publicProfile: any = null;
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { data: profile } = await serviceClient
        .from("users")
        .select("*")
        .eq("id", newUserId)
        .maybeSingle();

      if (profile) {
        publicProfile = profile;
        break;
      }
      console.log(`Profile not found yet (attempt ${i + 1}/5), retrying...`);
    }

    // ── 7. If trigger didn't create the profile, create it manually ─────
    if (!publicProfile) {
      console.log("Trigger did not create profile — inserting manually");

      const { data: insertedProfile, error: insertError } = await serviceClient
        .from("users")
        .insert({
          id: newUserId,
          email,
          full_name,
          role,
          department_id,
          designation_id,
          is_active: true,
        })
        .select("*")
        .single();

      if (insertError) {
        console.error("Manual profile insert failed:", insertError);
        return new Response(
          JSON.stringify({
            error: "Failed to create user profile",
            detail: insertError.message,
            id: newUserId,
            allocation_status: "skipped",
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      publicProfile = insertedProfile;
    }

    // ── 8. Update profile if trigger created it with default values ─────
    // Ensure the profile has the correct role, department, etc.
    const needsUpdate =
      publicProfile.role !== role ||
      publicProfile.department_id !== department_id ||
      publicProfile.designation_id !== designation_id ||
      publicProfile.is_active !== true;

    if (needsUpdate) {
      const { data: updatedProfile } = await serviceClient
        .from("users")
        .update({
          full_name,
          role,
          department_id,
          designation_id,
          is_active: true,
        })
        .eq("id", newUserId)
        .select("*")
        .single();

      if (updatedProfile) {
        publicProfile = updatedProfile;
      }
    }

    // ── 9. Allocate leave balances ──────────────────────────────────────
    const currentYear = new Date().getFullYear();
    let allocationStatus: "success" | "failed" = "success";
    let allocationError: string | null = null;

    try {
      console.log(
        `Allocating leave for user ${newUserId} for year ${currentYear}`,
      );

      const { error: allocError } = await serviceClient.rpc(
        "allocate_leave_for_user",
        {
          p_user_id: newUserId,
          p_year: currentYear,
        },
      );

      if (allocError) {
        console.error("Leave allocation RPC error:", allocError);
        allocationStatus = "failed";
        allocationError = allocError.message;
      } else {
        console.log("Leave allocation succeeded");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Leave allocation threw:", msg);
      allocationStatus = "failed";
      allocationError = msg;
    }

    // ── 10. Return flat response with all needed info ───────────────────
    return new Response(
      JSON.stringify({
        id: newUserId,
        email,
        full_name,
        role,
        department_id,
        designation_id,
        user: publicProfile,
        message: "User created successfully",
        allocation_status: allocationStatus,
        allocation_error: allocationError,
        allocation_year: currentYear,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    console.error("Unhandled error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});