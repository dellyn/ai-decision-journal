import { createClient } from "@/lib/supabase/server";
import { UserResponse } from "./types";

export async function getCurrentUser(): Promise<UserResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  return {
    user: data?.user ?? null,
    error: error
  };
} 