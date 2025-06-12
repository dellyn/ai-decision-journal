"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DecisionFormData } from "@/entities/decision";
import { decisionFormSchema } from "@/entities/decision";

export function useDecisionForm() {
  const form = useForm<DecisionFormData>({
    resolver: zodResolver(decisionFormSchema),
    defaultValues: {
      situation: "My wife and I have been experiencing communication issues lately. We've been arguing more frequently over small things, and there seems to be growing emotional distance between us. I noticed she's been stressed with work and our daily routines have become mechanical rather than meaningful.",
      decision: "I decided to plan a surprise weekend getaway to the place where we first met, along with sending her favorite flowers to her office. I also scheduled couples therapy sessions to help us improve our communication and understand each other better.",
      reasoning: "Taking time away from our daily environment could help us reconnect and remind us of our early relationship. The professional counseling will provide us with tools to better express our feelings and needs. I chose this approach because addressing both immediate emotional needs (flowers, getaway) and long-term relationship health (therapy) seems most likely to create lasting positive change.",
    },
  });

  return form;
}