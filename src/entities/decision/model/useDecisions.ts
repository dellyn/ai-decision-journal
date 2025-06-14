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

class DecisionCacheManager {
  constructor(private queryClient: QueryClient) {}

  update(decision: Decision, oldId?: string) {
    this.updateSingleDecision(decision, oldId);
    this.updateList(decision, oldId);
  }

  add(decision: Decision) {
    this.updateSingleDecision(decision);
    this.prependToList(decision);
  }

  remove(id: string) {
    this.queryClient.removeQueries({ queryKey: ["decision", id] });
    this.removeFromList(id);
  }

  private updateSingleDecision(decision: Decision, oldId?: string) {
    this.queryClient.setQueryData<Decision>(["decision", decision.id], decision);
    if (oldId) {
      this.queryClient.removeQueries({ queryKey: ["decision", oldId] });
    }
  }

  private updateList(decision: Decision, oldId?: string) {
    this.queryClient.setQueryData<PaginatedResponse>(
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

  private prependToList(decision: Decision) {
    this.queryClient.setQueryData<PaginatedResponse>(
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

  private removeFromList(id: string) {
    this.queryClient.setQueryData<PaginatedResponse>(
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
  const cache = new DecisionCacheManager(queryClient);

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

      cache.add(optimisticDecision);
      
      return { optimisticDecision, tempId };
    },
    onSuccess: (response, variables, context) => {
      onSuccess(response);
      if (context?.tempId) {
        cache.update(response, context.tempId);
      }
    },
    onError: (error, variables, context) => {
      if (context?.optimisticDecision) {
        cache.update({
          ...context.optimisticDecision,
          status: DecisionStatus.ERROR
        }, context.tempId);
      }
    }
  });
}

export function useRetryDecision() {
  const queryClient = useQueryClient();
  const cache = new DecisionCacheManager(queryClient);
  
  return useMutation<Decision, Error, string>({
    mutationFn: async (id) => {
      const response = await httpClient<Decision>(`${API_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: DecisionStatus.PROCESSING }),
      });
      return response;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["decision", id] });
      await queryClient.cancelQueries({ queryKey: ["decisions"] });

      const previousDecision = queryClient.getQueryData<Decision>(["decision", id]);
      
      if (previousDecision) {
        const optimisticDecision = {
          ...previousDecision,
          status: DecisionStatus.PROCESSING,
        };
        
        cache.update(optimisticDecision);
      }

      return { previousDecision };
    },
    onSuccess: (response) => {
      cache.update(response);
    }
  });
}

export function useDeleteDecision() {
  const queryClient = useQueryClient();
  const cache = new DecisionCacheManager(queryClient);
  
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => httpClient(`${API_URL}/${id}`, {method: "DELETE"}),
    onSuccess: (_, id) => {
      cache.remove(id);
    },
  });
} 