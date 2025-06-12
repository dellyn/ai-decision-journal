import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Decision, DecisionStatus } from "./types";

const API_URL = "/api/decisions";

export function useProcessingDecisions(decisions: Decision[]) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["processing-decisions"],
    queryFn: async () => {
      await Promise.all(
        decisions.map(async (decision: Decision) => {

          if (decision.status === DecisionStatus.PROCESSING) {

            const decisionResponse = await fetch(`${API_URL}/${decision.id}`);
   
            const updatedDecision = await decisionResponse.json();
            if (updatedDecision.status !== DecisionStatus.PROCESSING) {
              queryClient.setQueryData(["decision", updatedDecision.id], updatedDecision);
              queryClient.invalidateQueries({ queryKey: ["decisions"] });
            }
          }
        })
      );

      return null;
    },
    refetchInterval: 3000,
    staleTime: 0,
  });
} 