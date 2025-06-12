import { httpClient } from "@/shared/api/client";
import { Decision, DecisionFormData } from "@/entities/decision";
import { ApiRoutes } from "@/shared/api/routes";

export const decisionFormApi = {
  create: (data: DecisionFormData): Promise<Decision> => 
    httpClient<Decision>(ApiRoutes.DECISIONS, {
      method: "POST",
      body: data,
    }),
}; 