import { createClient } from "@/lib/supabase/client";

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://ai-decision-journal-azgysnyqk-dellyns-projects.vercel.app`
  : "https://ai-decision-journal.vercel.app";

export interface AuthFormData {
  email: string;
  password: string;
}

export interface SignUpFormData extends AuthFormData {
  repeatPassword: string;
}

export const authApi = {
  async login({ email, password }: AuthFormData) {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { success: true };
  },

  async signUp({ email, password }: SignUpFormData) {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${BASE_URL}/auth/callback`,
      },
    });
    if (error) throw error;
    return { success: true };
  },
}; 