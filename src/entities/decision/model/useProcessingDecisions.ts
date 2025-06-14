import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Decision, DecisionStatus } from "./types";
import { handleApiResponse } from "@/shared/api/error-handler";

const API_URL = "/api/decisions";

function updateDecisionCaches(queryClient: QueryClient, updatedDecision: Decision) {
  queryClient.invalidateQueries({ queryKey: ["decision", updatedDecision.id] });

  queryClient.setQueryData<{ data: Decision[]; total: number; page: number; pageSize: number }>(
    ["decisions", 1, 10],
    (old) => {
      if (!old) return { data: [updatedDecision], total: 1, page: 1, pageSize: 10 };
      return {
        ...old,
        data: old.data.map((d) => 
          d.id === updatedDecision.id ? updatedDecision : d
        ),
      };
    }
  );
}

export function useProcessingDecisions(decisions: Decision[] = []) {
  const queryClient = useQueryClient();
  const processingDecisions = decisions.filter(
    (decision) => decision.status === DecisionStatus.PROCESSING
  );

  return useQuery({
    queryKey: ["processing-decisions"],
    queryFn: async () => {
      await Promise.all(
        processingDecisions.map(async (decision) => {
          const response = await fetch(`${API_URL}/${decision.id}`);
          const updatedDecision = await handleApiResponse<Decision>(response);
          
          if (updatedDecision.status !== DecisionStatus.PROCESSING) {
            updateDecisionCaches(queryClient, updatedDecision);
          }
        })
      );
      return null;
    },
    refetchInterval: processingDecisions.length > 0 ? 5000 : false,
    staleTime: 0,
    enabled: processingDecisions.length > 0
  });
}