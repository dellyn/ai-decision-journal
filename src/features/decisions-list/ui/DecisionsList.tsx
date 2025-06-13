"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";
import { Routes } from "@/shared/routes";
import { useProcessingDecisions } from "@/entities/decision/model/useProcessingDecisions";
import { useDecisions } from "@/entities/decision/model/useDecisions";
import { DecisionListItem } from "./DecisionListItem";

// TODO: move to widgets
export function DecisionsList() {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, isLoading, error } = useDecisions(pageNumber, 10);
  const pathname = usePathname();
  const router = useRouter();

  useProcessingDecisions(data?.data);
  const handleDecisionClick = (decisionId: string) => {
    router.push(`${Routes.DECISIONS}/${decisionId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <p className="text-destructive">Error loading decisions</p>
        <Button onClick={() => setPageNumber(1)}>Retry</Button>
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
        TODO: Pagination
      </div>
    </div>
  );
}

