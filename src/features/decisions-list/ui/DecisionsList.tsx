"use client";

import { useEffect, useState } from "react";
import { DecisionRecord, PaginatedDecisions } from "@/lib/repositories/decisionRepository";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils";
import { usePathname, useRouter } from "next/navigation";
import { useDecisionStore } from "@/entities/decision";
import { Routes } from "@/shared/routes";

export function DecisionsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { decisions, setDecisions, setSelectedDecisionId } = useDecisionStore();

  const fetchDecisions = async (pageNumber: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/decisions?page=${pageNumber}&pageSize=10`);
      if (!response.ok) throw new Error("Failed to fetch decisions");
      const data: PaginatedDecisions = await response.json();
      setDecisions(data.data);
      setTotal(data.total);
      setPage(pageNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch decisions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleDecisionClick = (decisionId: string) => {
    setSelectedDecisionId(decisionId);
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
        <p className="text-destructive">{error}</p>
        <Button onClick={() => fetchDecisions(page)}>Retry</Button>
      </div>
    );
  }

  if (!decisions.length) {
    return (
      <div className="flex justify-center p-8">
        <p className="text-muted-foreground">No decisions yet</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2 p-4">
        {decisions.map((decision) => (
          <DecisionListItem 
            key={decision.id} 
            decision={decision} 
            isSelected={pathname === `${Routes.DECISIONS}/${decision.id}`}
            onClick={() => handleDecisionClick(decision.id)}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2 p-4 border-t">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => fetchDecisions(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={page * 10 >= total}
          onClick={() => fetchDecisions(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function getSummaryTitle(situation: string): string {
  const words = situation.split(/\s+/);
  return words.slice(0, 4).join(" ") + (words.length > 4 ? "..." : "");
}

function DecisionListItem({ 
  decision, 
  isSelected,
  onClick
}: { 
  decision: DecisionRecord; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-colors",
        isSelected ? "bg-muted" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">{getSummaryTitle(decision.situation)}</h3>
          {decision.analysis && (
            <p className="text-sm text-muted-foreground">
              {decision.analysis.category} • {decision.analysis.biases.length} biases
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {decision.status === "processing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : decision.status === "error" ? (
            <Badge variant="destructive">Error</Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
