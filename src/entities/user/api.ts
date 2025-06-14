import { createClient } from "@/lib/supabase/server";
import { User } from "@/entities/user/model/types";

export interface UserResponse {
  user: User | null;
  error: Error | null;
}


export async function getCurrentUser(): Promise<UserResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  return {
    user: data?.user ?? null,
    error: error
  };
} 