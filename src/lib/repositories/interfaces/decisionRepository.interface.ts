import { Decision, DecisionFormData, DecisionStatus } from "@/entities/decision";
import { DecisionRecord } from "../decisionRepository";

export interface IDecisionRepository {
  create(data: DecisionFormData, userId: string): Promise<DecisionRecord>;
  findById(id: string): Promise<DecisionRecord>;
  update(id: string, data: Partial<DecisionRecord>): Promise<DecisionRecord>;
  updateStatus(id: string, status: DecisionStatus): Promise<void>;
  updateAnalysis(id: string, analysis: Decision["analysis"]): Promise<void>;
  findAll(userId: string, page?: number, pageSize?: number): Promise<{
    data: DecisionRecord[];
    total: number;
    page: number;
    pageSize: number;
  }>;
  resetProcessing(id: string): Promise<void>;
} 