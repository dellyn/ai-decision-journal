// TODO: improve error handling, and fallbacks with local storage
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { Decision, DecisionFormData, DecisionStatus } from "./types";
import { httpClient } from "@/shared/api/client";

const API_URL = "/api/decisions";

interface PaginatedResponse {
  data: Decision[];
  total: number;
  page: number;
  pageSize: number;
}

interface MutationContext {
  optimisticDecision: Decision;
  tempId: string;
}

// Cache management functions
function updateDecisionCache(queryClient: QueryClient, decision: Decision, oldId?: string) {
  queryClient.setQueryData<Decision>(["decision", decision.id], decision);
  if (oldId) {
    queryClient.removeQueries({ queryKey: ["decision", oldId] });
  }
}

function updateDecisionsListCache(queryClient: QueryClient, decision: Decision, oldId?: string) {
  queryClient.setQueryData<PaginatedResponse>(
    ["decisions"],
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((d) => 
          (oldId ? d.id === oldId : d.id === decision.id) ? decision : d
        ),
      };
    }
  );
}

function updateCaches(queryClient: QueryClient, decision: Decision, oldId?: string) {
  updateDecisionCache(queryClient, decision, oldId);
  updateDecisionsListCache(queryClient, decision, oldId);
}

function addToDecisionsListCache(queryClient: QueryClient, decision: Decision) {
  queryClient.setQueryData<PaginatedResponse>(
    ["decisions"],
    (old) => {
      if (!old) return { data: [decision], total: 1, page: 1, pageSize: 10 };
      return {
        ...old,
        data: [decision, ...old.data],
        total: old.total + 1,
      };
    }
  );
}

function removeFromDecisionsListCache(queryClient: QueryClient, id: string) {
  queryClient.setQueryData<PaginatedResponse>(
    ["decisions"],
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.filter((d) => d.id !== id),
        total: old.total - 1,
      };
    }
  );
}

// Query hooks
export function useDecisions() {
  return useQuery<PaginatedResponse>({
    queryKey: ["decisions"],
    queryFn: () => httpClient(`${API_URL}?page=1&pageSize=10`),
  });
}

export function useDecision(id: string) {
  return useQuery<Decision>({
    queryKey: ["decision", id],
    queryFn: () => httpClient(`${API_URL}/${id}`),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateDecision({onSuccess}: {onSuccess: (response: Decision) => void}) {
  const queryClient = useQueryClient();

  return useMutation<Decision, Error, DecisionFormData, MutationContext>({
    mutationFn: (data: DecisionFormData) =>
      httpClient(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onMutate: async (newDecision) => {
      await queryClient.cancelQueries({ queryKey: ["decisions"] });
      
      const tempId = `temp-${crypto.randomUUID()}`;
      const optimisticDecision: Decision = {
        id: tempId,
        status: DecisionStatus.PROCESSING,
        situation: newDecision.situation,
        decision: newDecision.decision,
        reasoning: newDecision.reasoning,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      updateDecisionCache(queryClient, optimisticDecision);
      addToDecisionsListCache(queryClient, optimisticDecision);
      
      return { optimisticDecision, tempId };
    },
    onSuccess: (response, variables, context) => {
      onSuccess(response);
      if (context?.tempId) {
        updateCaches(queryClient, response, context.tempId);
      }
    },
    onError: (error, variables, context) => {
      if (context?.optimisticDecision) {
        updateCaches(queryClient, {
          ...context.optimisticDecision,
          status: DecisionStatus.ERROR
        }, context.tempId);
      }
    }
  });
}

export function useUpdateDecision() {
  const queryClient = useQueryClient();
  
  return useMutation<Decision, Error, { id: string; data: Partial<Decision> }>({
    mutationFn: async ({ id, data }) => {
      const response = await httpClient<Decision>(`${API_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return response;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["decision", id] });
      await queryClient.cancelQueries({ queryKey: ["decisions"] });

      const previousDecision = queryClient.getQueryData<Decision>(["decision", id]);
      
      if (previousDecision) {
        const optimisticDecision = {
          ...previousDecision,
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        updateCaches(queryClient, optimisticDecision);
      }

      return { previousDecision };
    },
    onSuccess: (response) => {
      updateCaches(queryClient, response);
    }
    
  });
}

export function useDeleteDecision() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => httpClient(`${API_URL}/${id}`, {method: "DELETE"}),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["decision", id] });
      removeFromDecisionsListCache(queryClient, id);
    },
  });
} 