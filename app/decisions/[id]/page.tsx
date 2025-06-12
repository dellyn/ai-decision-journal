"use client";

import { DecisionDetails } from "@/features/decision-details";
import { useDecision } from "@/entities/decision";
import { use } from "react";

interface DecisionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DecisionDetailPage({ params }: DecisionDetailPageProps) {
  const { id } = use(params);
  const { data, isLoading, error } = useDecision(id);

  if (error) {
    return <div>Error loading decision: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return <DecisionDetails decision={data} />;
} 