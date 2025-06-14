"use client";
import { Decision } from "@/entities/decision";
import { useRetryDecision } from "@/entities/decision/model/useDecisions";
import { PageHeader } from "@/shared/components/ui/page-header";
import { DecisionContent } from "@/entities/decision/ui/DecisionContent";
import { DecisionStatus as DecisionStatusComponent } from "@/entities/decision/ui/DecisionStatus";
import { DecisionAnalysis } from "@/entities/decision/ui/DecisionAnalysis";

interface DecisionDetailsProps {
  decision: Decision;
}

export function DecisionDetails({ decision }: DecisionDetailsProps) {
  const { mutate: retryAnalysis, isPending } = useRetryDecision();

  const handleRetry = () => {
    retryAnalysis(decision?.id)
  };

  if (!decision) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-muted-foreground">Decision not found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <PageHeader title="Decision Details" />
          <div className="space-y-6 p-6">
            <DecisionContent decision={decision} />
            <DecisionStatusComponent 
              status={decision.status} 
              isPending={isPending} 
              onRetry={handleRetry} 
            />
            {decision.analysis && (
              <DecisionAnalysis analysis={decision.analysis} />
            )}
          </div>
      </div>
    </div>
  );
} 