import { AuthGuard } from "@/widgets/auth-guard";

export async function ProtectedPage() {
  return <AuthGuard />;
}
