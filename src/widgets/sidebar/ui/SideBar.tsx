"use client";
import { Button } from "@/shared/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";
import { DecisionsList } from "@/features/DecisionsList";
import { useRouter } from "next/navigation";
import { Routes } from "@/shared/routes";
import { useUIStore } from "@/shared/store/ui";

export function SideBar() {
  const router = useRouter();
  const { closeSidebar } = useUIStore();

  const handleAddDecision = () => {
    router.push(Routes.DECISIONS);
    closeSidebar();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="hidden md:block p-4 border-b">
        <Button 
          variant="default" 
          className="w-full shadow-md font-bold p-6 text-md"
          onClick={handleAddDecision}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Decision
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <DecisionsList onItemClick={closeSidebar} />
      </div>
      <div className="md:hidden flex flex-col gap-4 p-4 border-t">
        <Button 
          variant="default" 
          className="w-full shadow-md font-bold p-6 text-md"
          onClick={handleAddDecision}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Decision
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            router.push(Routes.DASHBOARD);
            closeSidebar();
          }}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </div>
    </div>
  );
}