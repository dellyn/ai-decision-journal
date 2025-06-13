import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils";
import { Decision, DecisionStatus } from "@/entities/decision";
import { Loader2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

function getSummaryTitle(situation: string): string {
  if (!situation) return '';
  return situation.length > 50 ? situation.slice(0, 100) + '' : situation;
}

export function DecisionListItem({ 
  decision, 
  isSelected,
  onClick
}: { 
  decision: Decision; 
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
        <div className="flex flex-col gap-1 overflow-hidden">
          <h3 className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">{decision.situation}</h3>
          {decision.analysis && (
            <p className="text-sm text-muted-foreground">
              {decision.analysis.category} • {decision.analysis.biases.length} biases
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {decision.status === DecisionStatus.PROCESSING ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : decision.status === DecisionStatus.ERROR ? (
            <Badge variant="destructive">Error</Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
