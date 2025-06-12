"use client";

import { TwoColumnLayout } from "@/shared/layouts/TwoColumnLayout";
import { DecisionsList } from "@/features/decisions-list";
import { DecisionForm } from "@/features/decision-form";
import { DecisionDetails } from "@/features/decision-details";
import { useDecisionStore } from "@/entities/decision";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setSelectedDecisionId, selectedDecisionId, getDecisionById } = useDecisionStore();
  
  // Extract decision ID from URL if present
  const decisionId = pathname.split('/').pop();
  const isDecisionPage = decisionId && decisionId !== 'chat';
  
  // Set initial decision ID from URL if present
  useEffect(() => {
    if (isDecisionPage) {
      setSelectedDecisionId(decisionId);
    } else {
      setSelectedDecisionId(null);
    }
  }, [isDecisionPage, decisionId, setSelectedDecisionId]);

  const decision = selectedDecisionId ? getDecisionById(selectedDecisionId) : null;

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