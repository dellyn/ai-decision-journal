import { Card } from "@/shared/components/ui/card";
import { Decision } from "../model/types";

interface DecisionContentProps {
  decision: Decision;
}

export function DecisionContent({ decision }: DecisionContentProps) {
  return (
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
    </div>
  );
} 