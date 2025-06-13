import { ThemeSwitcher } from "@/features/theme-switcher";
import { AuthButton } from "@/widgets/auth-button";
import { getCurrentUser } from "@/entities/user/api";

export async function Header() {
  const { user } = await getCurrentUser();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </div>
        <AuthButton user={user} />
      </div>
    </nav>
  )
}