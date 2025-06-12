"use client";

import { DecisionForm } from "@/features/decision-form";
import { DecisionsList } from "@/features/decisions-list";
import { DecisionDetails } from "@/features/decision-details";
import { useDecisionStore } from "@/entities/decision";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { TwoColumnLayout } from "@/shared/layouts/TwoColumnLayout";

export default function ChatDecisionPage() {
  const params = useParams();
  const { getDecisionById, setSelectedDecisionId, decisions } = useDecisionStore();
  const decision = getDecisionById(params.id as string);

  useEffect(() => {
    setSelectedDecisionId(params.id as string);
  }, [params.id, setSelectedDecisionId]);

  useEffect(() => {
    if (!decision && decisions.length === 0) {
      fetch(`/api/decisions?page=1&pageSize=10`)
        .then(res => res.json())
        .then(data => {
          useDecisionStore.getState().setDecisions(data.data);
        });
    }
  }, [decision, decisions.length]);

  return (
    <TwoColumnLayout
      sidebar={<DecisionsList />}
    >
      {decision ? (
        <DecisionDetails decision={decision} />
      ) : (
        <DecisionForm />
      )}
    </TwoColumnLayout>
  );
} 