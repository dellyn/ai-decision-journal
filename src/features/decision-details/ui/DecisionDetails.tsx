"use client";

import { DecisionRecord } from "@/entities/decision";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { useDecisionStore } from "@/entities/decision";
import { Routes } from "@/shared/routes";

interface DecisionDetailsProps {
  decision: DecisionRecord;
}

export function DecisionDetails({ decision }: DecisionDetailsProps) {
  const router = useRouter();
  const { setSelectedDecisionId } = useDecisionStore();

  const handleClose = () => {
    setSelectedDecisionId(null);
    router.push(Routes.DECISIONS);
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Decision Details</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Situation</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{decision.situation}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-2">Decision</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{decision.decision}</p>
          </Card>

          {decision.reasoning && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2">Reasoning</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{decision.reasoning}</p>
            </Card>
          )}

          {decision.status === "processing" ? (
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Analyzing decision...</p>
              </div>
            </Card>
          ) : decision.status === "error" ? (
            <Card className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Error</Badge>
                  <p>Failed to analyze decision</p>
                </div>
                <Button variant="outline" onClick={() => fetch(`/api/decisions/${decision.id}/retry`, { method: "POST" })}>
                  Retry Analysis
                </Button>
              </div>
            </Card>
          ) : decision.analysis ? (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Analysis</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Category</h3>
                  <Badge variant="secondary">{decision.analysis.category}</Badge>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Cognitive Biases</h3>
                  <div className="flex flex-wrap gap-2">
                    {decision.analysis.biases.map((bias) => (
                      <Badge key={bias} variant="outline">
                        {bias}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Missed Alternatives</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {decision.analysis.alternatives.map((alternative) => (
                      <li key={alternative} className="text-muted-foreground">
                        {alternative}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
} 