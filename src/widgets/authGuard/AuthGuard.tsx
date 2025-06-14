import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Routes } from "@/shared/routes";
import { getCurrentUser } from "@/entities/user/api";

interface AuthGuardProps {
  children?: ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const { user } = await getCurrentUser();

  if ( !user) {
    redirect(Routes.SIGN_UP);
  }

  return children;
} 