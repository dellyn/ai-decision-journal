import { z } from "zod";

// TODO: use validation on the form and api
export const decisionFormSchema = z.object({
  situation: z.string()
    .min(10, "Situation must be at least 10 characters")
    .max(1000, "Situation must be less than 1000 characters"),
  decision: z.string()
    .min(5, "Decision must be at least 5 characters")
    .max(500, "Decision must be less than 500 characters"),
  reasoning: z.string()
    .max(500, "Reasoning must be less than 500 characters")
    .optional(),
});

export type DecisionFormData = z.infer<typeof decisionFormSchema>;
