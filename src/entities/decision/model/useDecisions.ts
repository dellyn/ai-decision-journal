import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Decision, DecisionFormData, DecisionStatus } from "./types";

const API_URL = "/api/decisions";

interface PaginatedResponse {
  data: Decision[];
  total: number;
  page: number;
  pageSize: number;
}



export function useDecisions(page: number = 1, pageSize: number = 10) {
  return useQuery<PaginatedResponse>({
    queryKey: ["decisions", page, pageSize],
    queryFn: () => fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`).then((res) => res.json()),
  });
}

export function useDecision(id: string) {
  return useQuery<Decision>({
    queryKey: ["decision", id],
    queryFn: () => fetch(`${API_URL}/${id}`).then((res) => res.json()),
    enabled: !!id,
  });
}

export function useCreateDecision({onSuccess}: {onSuccess: (response: Decision) => void}) {
  const queryClient = useQueryClient();

  return useMutation<Decision, Error, DecisionFormData>({
    mutationFn: (data: DecisionFormData) =>
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: (response) => {
      onSuccess(response);
      
      // Update the decisions list cache
      queryClient.setQueryData<PaginatedResponse>(
        ["decisions", 1, 10],
        (old) => {
          if (!old) return { data: [response], total: 1, page: 1, pageSize: 10 };
          return {
            ...old,
            data: [response, ...old.data],
            total: old.total + 1,
          };
        }
      );

      // Set the individual decision cache
      queryClient.setQueryData(["decision", response.id], response);
    },
  });
}

export function useUpdateDecision() {
  const queryClient = useQueryClient();
  
  return useMutation<Decision, Error, { id: string; data: Partial<Decision> }>({
    mutationFn: async ({ id, data }) => {
      // If we're retrying analysis, use the retry endpoint
      if (data.status === DecisionStatus.PROCESSING) {
        const response = await fetch(`${API_URL}/${id}/retry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error('Failed to retry analysis');
        }

        return response.json();
      }

      // Otherwise use the regular update endpoint
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update decision');
      }

      return response.json();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      queryClient.setQueryData(["decision", response.id], response);
    },
  });
}

export function useDeleteDecision() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id: string) =>
      fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
    },
  });
} 