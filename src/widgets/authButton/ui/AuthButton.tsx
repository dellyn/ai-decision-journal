/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogoutButton } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";


export function AuthButton({ user }: any) {
  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <a href="/auth/login">Sign in</a>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <a href="/auth/sign-up">Sign up</a>
      </Button>
    </div>
  );
}
