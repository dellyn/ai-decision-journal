import { useDecision } from "@/entities/decision";
import { DecisionDetails } from "@/features/DecisionDetails";
import { Routes } from "@/shared/routes";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/widgets/ErrorState";
import { LoadingState } from "@/widgets/LoadingState";

interface DecisionDetailsSlotProps {
  id: string;
}

export function DecisionDetailsSlot({ id }: DecisionDetailsSlotProps) {
  const router = useRouter();
  const { data: decision, isLoading, error } = useDecision(id);
console.log("error", error)
  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <ErrorState
          title="Error Loading Decision"
          message={error.message || "Something went wrong while loading the decision."}
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <LoadingState
          title="Loading Decision"
          message="Please wait while we fetch the decision details..."
        />
      </div>
    );
  }

  if (!decision?.id) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <ErrorState
          title="Decision Not Found"
          message="The decision you're looking for doesn't exist or has been removed."
          backUrl={Routes.DECISIONS}
        />
      </div>
    );
  }

  return <DecisionDetails decision={decision} />;
} 