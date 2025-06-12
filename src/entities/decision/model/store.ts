import { create } from "zustand";
import { Decision } from "./types";

interface DecisionStore {
  decisions: Decision[];
  selectedDecisionId: string | null;
  setDecisions: (decisions: Decision[]) => void;
  addDecision: (decision: Decision) => void;
  updateDecision: (decision: Decision) => void;
  deleteDecision: (id: string) => void;
  setSelectedDecisionId: (id: string | null) => void;
  getSelectedDecision: () => Decision | undefined;
}

export const useDecisionStore = create<DecisionStore>((set, get) => ({
  decisions: [],
  selectedDecisionId: null,
  setDecisions: (decisions) => set({ decisions }),
  addDecision: (decision) => set((state) => ({
    decisions: [decision, ...state.decisions],
  })),
  updateDecision: (decision) => set((state) => ({
    decisions: state.decisions.map((d) => (d.id === decision.id ? decision : d)),
  })),
  deleteDecision: (id) => set((state) => ({
    decisions: state.decisions.filter((d) => d.id !== id),
  })),
  setSelectedDecisionId: (id) => set({ selectedDecisionId: id }),

  getDecisionById: (id) => get().decisions.find((decision) => decision.id === id),

})); 