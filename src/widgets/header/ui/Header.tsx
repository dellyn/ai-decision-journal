import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher";
import { AuthButton } from "@/widgets/AuthButton";
import { MenuButton } from "./MenuButton";
import { getCurrentUser } from "@/entities/user/api";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { Routes } from "@/shared/routes";

export async function Header() {
  const { user } = await getCurrentUser();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex items-center gap-2">
          <MenuButton />
          <Link 
            href={Routes.DASHBOARD}
            className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
            <AuthButton user={user} />
            <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}