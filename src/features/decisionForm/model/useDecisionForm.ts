"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { decisionFormSchema } from "@/entities/decision/model/schema";
import { DecisionFormData } from "@/entities/decision/model/types";
import { useFormPersistence } from "./useFormPersistence";

const defaultValues = {
  situation: "",
  decision: "",
  reasoning: "",
};

export function useDecisionForm() {
  const form = useForm<DecisionFormData>({
    resolver: zodResolver(decisionFormSchema),
    defaultValues,
  });

  const { resetStorage } = useFormPersistence(form, "decision-form-data");

  const reset = () => {
    resetStorage();
    form.reset(defaultValues);
  };

  return { form, reset };
}