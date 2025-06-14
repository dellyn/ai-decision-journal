import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Routes } from "@/shared/routes";
// import { checkAuth } from "@/features/auth/model/check-auth";

interface AuthGuardProps {
  children?: ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(Routes.SIGN_UP);
  }

  return children;
} 