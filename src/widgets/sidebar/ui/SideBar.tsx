"use client";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { DecisionsList } from "@/features/DecisionsList";
import { useRouter } from "next/navigation";
import { Routes } from "@/shared/routes";
import { useUIStore } from "@/shared/store/ui";
import { useIsMobile } from "@/shared/utils/responsive";

export function SideBar() {
  const router = useRouter();
  const { closeSidebar } = useUIStore();
  const isMobile = useIsMobile();

  const handleAddDecision = () => {
    router.push(Routes.DECISIONS);
    closeSidebar();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {!isMobile && (
        <div className="p-4 border-b">
          <Button 
            variant="default" 
            className="w-full shadow-md font-bold p-6 text-md"
            onClick={handleAddDecision}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Decision
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <DecisionsList onItemClick={closeSidebar} />
      </div>
      {isMobile && (
        <div className="p-4 border-t">
          <Button 
            variant="default" 
            className="w-full shadow-md font-bold p-6 text-md"
            onClick={handleAddDecision}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Decision
          </Button>
        </div>
      )}
    </div>
  );
}