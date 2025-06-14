import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Decision, DecisionStatus } from "./types";
import { httpClient } from "@/shared/api/client";

const API_URL = "/api/decisions";

function updateDecisionCaches(queryClient: QueryClient, updatedDecision: Decision) {
  queryClient.invalidateQueries({ queryKey: ["decision", updatedDecision.id] });
  queryClient.invalidateQueries({ queryKey: ["decisions"] });
  // queryClient.setQueryData<{ data: Decision[]; total: number; page: number; pageSize: number }>(
  //   ["decisions"],
  //   (old) => {
  //     if (!old) return { data: [updatedDecision], total: 1, page: 1, pageSize: 10 };
  //     return {
  //       ...old,
  //       data: old.data.map((d) => 
  //         d.id === updatedDecision.id ? updatedDecision : d
  //       ),
  //     };
  //   }
  // );
}

export function useProcessingDecisions(decisions: Decision[] = []) {
  const queryClient = useQueryClient();
  const processingDecisions = decisions.filter(
    (decision) => decision.status === DecisionStatus.PROCESSING
  );

  return useQuery({
    queryKey: ["processing-decisions"],
    queryFn: async () => {
      try {
        const results = await Promise.all(
          processingDecisions.map(async (decision) => {
            try {
              const response = await httpClient<Decision>(`${API_URL}/${decision.id}`);
              if (response.status !== DecisionStatus.PROCESSING) {
                updateDecisionCaches(queryClient, response);
              }
              return response;
            } catch (error) {
              return error;
            }
          })
        );
        return results.filter(Boolean);
      } catch (error) {
        console.error('Error in processing decisions query:', error);
        return [];
      }
    },
    refetchInterval: processingDecisions.length > 0 ? 5000 : false,
    staleTime: 0,
    enabled: processingDecisions.length > 0
  });
}