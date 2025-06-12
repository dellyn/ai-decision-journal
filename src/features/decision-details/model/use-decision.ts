import { useEffect, useState } from "react";
import { useDecisionStore, Decision } from "@/entities/decision";
import { decisionApi } from "@/entities/decision/api/decisionApi";

export function useDecision(decisionId: string): { decision: Decision | null, isLoading: boolean, error: Error | null } {
  const { getDecisionById } = useDecisionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const decision = getDecisionById(decisionId);
  console.log({decision, decisionId})
  
  useEffect(() => {
    if (!decision) {
      const fetchDecision = async () => {
        try {
          setIsLoading(true);
          const decisionResponse = await decisionApi.getById  (decisionId);
          return decisionResponse;
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDecision();
    }
  }, [decision, decisionId]);

  return {
    decision,
    isLoading,
    error
  };
}