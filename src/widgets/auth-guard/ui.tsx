import { ReactNode } from "react";
import { checkAuth } from "@/features/auth";
import { UserProfile } from "@/features/user-profile";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

interface AuthGuardProps {
  children?: ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const user = await checkAuth();

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      
      <UserProfile user={user} />
      
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>

      {children}
    </div>
  );
} 