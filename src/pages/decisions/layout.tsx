"use client";

import { TwoColumnLayout } from "@/shared/layouts/TwoColumnLayout";
import { DecisionsList } from "@/features/decisions-list";
import { DecisionForm } from "@/features/decision-form";
import { DecisionDetails } from "@/features/decision-details";
import { useDecisionStore } from "@/entities/decision";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Routes } from "@/shared/routes";
import { Header } from "@/widgets/header";

export default function DecisionsLayout() {
  const pathname = usePathname();
  const { setSelectedDecisionId, selectedDecisionId, getDecisionById } = useDecisionStore();
  
  const decisionId = pathname.split('/').pop();
  const isDecisionPage = decisionId && decisionId !== Routes.DECISIONS;
  
  useEffect(() => {
    if (isDecisionPage) {
      setSelectedDecisionId(decisionId);
    } else {
      setSelectedDecisionId(null);
    }
  }, [isDecisionPage, decisionId, setSelectedDecisionId]);

  const decision = selectedDecisionId ? getDecisionById(selectedDecisionId) : null;

  return (
    <div>
    <Header />
    <TwoColumnLayout
      sidebar={<DecisionsList />}
    >
      {decision ? (
        <DecisionDetails decision={decision} />
      ) : (
        <DecisionForm />
      )}
    </TwoColumnLayout>
    </div>
  );
} 