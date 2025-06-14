import { Button } from "@/shared/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBackButton?: boolean;
  backUrl?: string;
}

export function ErrorState({
  title = "Error",
  message = "Something went wrong.",
  onRetry,
  showBackButton = true,
  backUrl,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="container max-w-2xl py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <div className="flex gap-3">
            {showBackButton && (
              <Button
                variant="outline"
                onClick={() => backUrl ? router.push(backUrl) : router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
            {onRetry && (
              <Button onClick={onRetry} className="gap-2">
                Try Again
              </Button>
            )}
          </div>
        </div>
    </div>
  );
} 