"use client";

import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { DecisionsList } from "@/features/decisions-list";
import { useRouter } from "next/navigation";
import { Routes } from "@/shared/routes";

export function SideBar() {
  const router = useRouter();

  const handleAddDecision = () => {
    router.push(Routes.DECISIONS);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4">
        <Button 
          variant="default" 
          className="w-full shadow-md"
          onClick={handleAddDecision}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Decision
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <DecisionsList />
      </div>
    </div>
  );
}