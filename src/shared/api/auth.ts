import { createClient } from "@/lib/supabase/client";
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
        emailRedirectTo: `${window.location.origin}/protected`,
      },
    });
    if (error) throw error;
    return { success: true };
  },
}; 