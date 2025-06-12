import { create } from "zustand";
import { DecisionRecord } from "../types";

interface DecisionState {
  decisions: DecisionRecord[];
  selectedDecisionId: string | null;
  setDecisions: (decisions: DecisionRecord[]) => void;
  setSelectedDecisionId: (id: string | null) => void;
  getDecisionById: (id: string) => DecisionRecord | undefined;
}

export const useDecisionStore = create<DecisionState>((set, get) => {
  return {
  decisions: [],
  selectedDecisionId: null,
  setDecisions: (decisions) => set({ decisions }),
  setSelectedDecisionId: (id) => set({ selectedDecisionId: id }),
  getDecisionById: (id) => get().decisions.find((decision) => decision.id === id),
}
}); 