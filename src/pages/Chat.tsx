"use client";
import { useState } from "react";
import { DecisionForm } from "@/features/decision-form";
import { DecisionsList } from "@/features/decisions-list";
import { DecisionDetails } from "@/features/decision-details";
import { DecisionRecord } from "@/entities/decision";

export function Chat() {
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord | null>(null);

  return (
    <div className="grid grid-cols-[2fr_5fr] h-[calc(100vh-4rem)]">
      <div className="border-r overflow-y-auto">
        <DecisionsList onSelectDecision={setSelectedDecision} selectedDecision={selectedDecision} />
      </div>
      <div className="overflow-y-auto">
        {selectedDecision ? (
          <DecisionDetails decision={selectedDecision} />
        ) : (
          <DecisionForm />
        )}
      </div>
    </div>
  );
}