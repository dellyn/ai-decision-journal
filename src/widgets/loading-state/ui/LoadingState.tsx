import { Card } from "@/shared/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  message?: string;
}

export function LoadingState({
  title = "Loading",
  message = "Please wait...",
}: LoadingStateProps) {
  return (
    <div className="container max-w-2xl py-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="space-y-2 text-center">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
    </div>
  );
} 