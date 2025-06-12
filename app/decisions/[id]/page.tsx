"use client";

import { DecisionDetails } from "@/features/decision-details";
import { useDecision } from "@/features/decision-details/model/use-decision";
import { use } from "react";

interface DecisionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DecisionDetailPage({ params }: DecisionDetailPageProps) {
  const { id } = use(params);
  const { decision, isLoading, error } = useDecision(id);

  if (error) {
    return <div>Error loading decision: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!decision) {
    return <div>Decision not found</div>;
  }

  return <DecisionDetails decision={decision} />;
} 