"use client";

import { Button } from "@/shared/components/ui/button";
import { Menu } from "lucide-react";
import { useUIStore } from "@/shared/store/ui";

export function MenuButton() {
  const { openSidebar } = useUIStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openSidebar}
      className="lg:hidden"
    >
      <Menu className="h-4 w-4" />
    </Button>
  );
} 