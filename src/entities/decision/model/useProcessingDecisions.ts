import { useEffect } from "react";
import { useDecisionStore } from "./store";
import { DecisionStatus } from "./types";
import { decisionApi } from "@/entities/decision/api/decisionApi";

const POLLING_INTERVAL = 3000;

export function useProcessingDecisions() {
  const { decisions, updateDecision } = useDecisionStore();

  useEffect(() => {
    const processingDecisions = decisions.filter(
      (decision) => decision.status === DecisionStatus.PROCESSING
    );

    if (processingDecisions.length === 0) return;

    const pollDecisions = async () => {
      const results = await Promise.allSettled(
        processingDecisions.map(async (decision) => {
          try {
            const response = await decisionApi.getById(decision.id);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
          } catch (error) {
            console.error(`Error polling decision ${decision.id}:`, error);
            return null;
          }
        })
      );

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          const decision = result.value;
          if (decision.status !== DecisionStatus.PROCESSING) {
            updateDecision(decision);
          }
        }
      });
    };

    const intervalId = setInterval(pollDecisions, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [decisions, updateDecision]);
} 