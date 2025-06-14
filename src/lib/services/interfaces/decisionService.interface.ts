import { Decision, DecisionFormData, DecisionStatus } from "@/entities/decision";
import { DecisionRecord } from "@/lib/repositories/decisionRepository";

export interface IDecisionService {
  createDecision(data: DecisionFormData, userId: string): Promise<DecisionRecord>;
  getDecisionById(id: string): Promise<DecisionRecord>;
  updateDecision(id: string, data: Partial<DecisionRecord>): Promise<DecisionRecord>;
  updateDecisionStatus(id: string, status: DecisionStatus): Promise<void>;
  updateDecisionAnalysis(id: string, analysis: Decision["analysis"]): Promise<void>;
  getDecisions(userId: string, page?: number, pageSize?: number): Promise<{
    data: DecisionRecord[];
    total: number;
    page: number;
    pageSize: number;
  }>;
  resetDecisionProcessing(id: string): Promise<void>;
  processDecision(decision: DecisionRecord): Promise<void>;
} 