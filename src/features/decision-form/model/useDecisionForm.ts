"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DecisionFormData } from "@/entities/decision";
import { decisionFormSchema } from "@/entities/decision";

export function useDecisionForm() {
  const form = useForm<DecisionFormData>({
    resolver: zodResolver(decisionFormSchema),
    defaultValues: {
      situation: "",
      decision: "",
      reasoning: "",
    },
  });

  return form;
} 