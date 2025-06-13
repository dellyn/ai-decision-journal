"use client";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { Decision } from "@/entities/decision";
import { useUpdateDecision } from "@/entities/decision/model/useDecisions";
import { DecisionStatus } from "@/entities/decision/model/types";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Routes } from "@/shared/routes";
interface DecisionDetailsProps {
  decision: Decision;
}

function DecisionDetailsHeader({ onClose }: { onClose: () => void }) {


  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Decision Details</h1>
        </div>
      </div>
    </div>
  );
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
      <DecisionDetailsHeader onClose={handleClose} />
      <div className="flex-1 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-rounded scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="p-6">
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

            {decision.status === DecisionStatus.PROCESSING || isPending ? (
              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-muted-foreground">Our AI is analyzing your decision to provide personalized insights...</p>
                </div>
              </Card>
            ) : decision.status === "error" ? (
              <Card className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Error</Badge>
                    <p>Failed to analyze decision</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      'Retry Analysis'
                    )}
                  </Button>
                </div>
              </Card>
            ) : decision.analysis ? (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-lg shadow-md w-fit">AI Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2 mt-8">Category</h3>
                    <Badge variant="secondary">{decision.analysis.category}</Badge>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 mt-8">Cognitive Biases</h3>
                    {decision.analysis.biases.length > 0 ? (
                      <div className="space-y-3">
                        {decision.analysis.biases.map((bias) => (
                          <div key={bias.name} className="space-y-1 mb-4">
                            <Badge variant="outline" className="mb-2">{bias.name}</Badge>
                            <p className="text-sm text-muted-foreground pt-2">{bias.description}</p>
                             {bias.evidence && (
                              <blockquote className="text-sm italic border-l-2 border-muted pl-4">
                                &ldquo;{bias.evidence}&rdquo;
                              </blockquote>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No cognitive biases detected in this decision.</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium mt-2 mt-8">Alternative Decisions</h3>
                    {decision.analysis.alternatives.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {decision.analysis.alternatives.map((alternative) => (
                          <li key={alternative} className="text-muted-foreground">
                            {alternative}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No alternative decisions suggested.</p>
                    )}
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
} 