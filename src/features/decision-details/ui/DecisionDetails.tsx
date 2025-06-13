"use client";
import { useRouter } from "next/navigation";
import { Decision } from "@/entities/decision";
import { useUpdateDecision } from "@/entities/decision/model/useDecisions";
import { DecisionStatus } from "@/entities/decision/model/types";
import { Routes } from "@/shared/routes";
import { PageHeader } from "@/shared/components/ui/page-header";
import { DecisionContent } from "@/entities/decision/ui/DecisionContent";
import { DecisionStatus as DecisionStatusComponent } from "@/entities/decision/ui/DecisionStatus";
import { DecisionAnalysis } from "@/entities/decision/ui/DecisionAnalysis";
import { X } from "lucide-react";

interface DecisionDetailsProps {
  decision: Decision;
}

export function DecisionDetails({ decision }: DecisionDetailsProps) {
  const router = useRouter();
  const { mutate: retryAnalysis, isPending } = useUpdateDecision();

  const handleClose = () => {
    router.push(Routes.DECISIONS);
  };

  const handleRetry = () => {
    retryAnalysis(
      {
        id: decision.id,
        data: { status: DecisionStatus.PROCESSING }
      },
      {
        onError: (error) => {
          console.error('Failed to retry analysis:', error);
        }
      }
    );
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
      <PageHeader title="Decision Details" onClose={handleClose}  />
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