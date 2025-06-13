import { redirect } from "next/navigation";
import { getCurrentUser } from "@/entities/user/api";

export async function checkAuth() {
  const { user, error } = await getCurrentUser();
  console.log(2, 'user', user, error);
  
  if (error || !user) {
    redirect("/auth/login");
  }
  
  return user;
} 