"use client";

import { DecisionForm } from "@/features/decision-form";
import { DecisionsList } from "@/features/decisions-list";
import { DecisionDetails } from "@/features/decision-details";
import { TwoColumnLayout } from "@/shared/layouts/TwoColumnLayout";
import { useDecision } from "@/features/decision-details/model/use-decision";

interface DecisionPageProps {
  decisionId: string;
}

export function DecisionPage({ decisionId }: DecisionPageProps) {
  const { decision, isLoading, error } = useDecision(decisionId);

  if (error) {
    return <div>Error loading decision: {error.message}</div>;
  }

  return (
    <TwoColumnLayout sidebar={<DecisionsList />}>
      {isLoading ? (
        <div>Loading...</div>
      ) : decision ? (
        <DecisionDetails decision={decision} />
      ) : (
        <DecisionForm />
      )}
    </TwoColumnLayout>
  );
} 