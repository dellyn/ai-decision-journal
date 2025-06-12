import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Decision, DecisionFormData } from "./types";

const API_URL = "/api/decisions";

interface PaginatedResponse {
  data: Decision[];
  total: number;
  page: number;
  pageSize: number;
}

interface ApiResponse {
  data: PaginatedResponse;
}

export function useDecisions(page: number = 1, pageSize: number = 10) {
  return useQuery<ApiResponse>({
    queryKey: ["decisions", page, pageSize],
    queryFn: () => fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`).then((res) => res.json()),
  });
}

export function useDecision(id: string) {
  return useQuery<{ data: Decision }>({
    queryKey: ["decision", id],
    queryFn: () => fetch(`${API_URL}/${id}`).then((res) => res.json()),
    enabled: !!id,
  });
}

export function useCreateDecision({onSuccess}: {onSuccess: (response: { data: Decision }) => void}) {
  const queryClient = useQueryClient();

  return useMutation<{ data: Decision }, Error, DecisionFormData>({
    mutationFn: (data: DecisionFormData) =>
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
      onSuccess: (response) => {
        console.log(3,response)
        onSuccess(response);
        queryClient.invalidateQueries({ queryKey: ["decisions"] });
        queryClient.setQueryData(["decision", response.id], response);
    },
  });
}

export function useUpdateDecision() {
  const queryClient = useQueryClient();
  
  return useMutation<{ data: Decision }, Error, { id: string; data: Partial<Decision> }>({
    mutationFn: ({ id, data }) =>
      fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      queryClient.setQueryData(["decision", response.data.id], response);
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