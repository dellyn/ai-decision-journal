import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Decision, DecisionStatus } from "./types";

const API_URL = "/api/decisions";

export function useProcessingDecisions(decisions: Decision[]  = []) {
  console.log('decisions', decisions);
  const queryClient = useQueryClient();
  const processingDecisions = decisions.filter(
    (decision) => decision.status === DecisionStatus.PROCESSING
  );

  return useQuery({
    queryKey: ["processing-decisions"],
    queryFn: async () => {
      await Promise.all(
        processingDecisions.map(async (decision) => {
          const decisionResponse = await fetch(`${API_URL}/${decision.id}`);
          const updatedDecision = await decisionResponse.json();
          if (updatedDecision.status !== DecisionStatus.PROCESSING) {
            queryClient.setQueryData(["decision", updatedDecision.id], updatedDecision);
            queryClient.invalidateQueries({ queryKey: ["decisions"] });
          }
        })
      );
      return null;
    },
    refetchInterval: processingDecisions.length > 0 ? 3000 : false,
    staleTime: 0,
    enabled: processingDecisions.length > 0
  });
}