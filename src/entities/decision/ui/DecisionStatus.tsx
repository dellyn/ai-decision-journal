import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";
import { DecisionStatus as DecisionStatusType } from "../model/types";

interface DecisionStatusProps {
  status: DecisionStatusType;
  isPending: boolean;
  onRetry: () => void;
}

export function DecisionStatus({ status, isPending, onRetry }: DecisionStatusProps) {
  if (status === DecisionStatusType.PROCESSING || isPending) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-muted-foreground">Our AI is analyzing your decision to provide personalized insights...</p>
        </div>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Error</Badge>
            <p>Failed to analyze decision</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onRetry}
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
    );
  }

  return null;
} 