"use client";

import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Routes } from "@/shared/routes";
import { useProcessingDecisions } from "@/entities/decision/model/useProcessingDecisions";
import { useDecisions } from "@/entities/decision/model/useDecisions";
import { DecisionListItem } from "./DecisionListItem";

interface DecisionsListProps {
  onItemClick?: () => void;
}

// TODO: move to widgets, add error handling
export function DecisionsList({ onItemClick }: DecisionsListProps) {
  const { data, isLoading } = useDecisions();
  const pathname = usePathname();
  const router = useRouter();


  useProcessingDecisions(data?.data);
  const handleDecisionClick = (decisionId: string) => {
    router.push(`${Routes.DECISIONS}/${decisionId}`);
    onItemClick?.();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="flex justify-center p-8">
        <p className="text-muted-foreground">No decisions yet</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2 p-4 scrollbar scrollbar-w-2 scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {data.data?.map((decision) => (
          <DecisionListItem 
            key={decision?.id} 
            decision={decision} 
            isSelected={pathname === `${Routes.DECISIONS}/${decision.id}`}
            onClick={() => handleDecisionClick(decision.id)}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 p-4 border-t">
        TODO: Infinite scroll or pagination
      </div>
    </div>
  );
}

