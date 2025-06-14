import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Routes } from "@/shared/routes";

export default async function Main() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect(Routes.SIGN_UP);
  }

  redirect(Routes.DECISIONS);
}