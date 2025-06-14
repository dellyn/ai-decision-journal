import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/client";
import { DecisionAnalytics } from "@/lib/services/interfaces/dashboardService.interface";

export function useDashboard() {
  return useQuery<DecisionAnalytics>({
    queryKey: ["dashboard"],
    queryFn: () => httpClient("/api/dashboard"),
  });
} 