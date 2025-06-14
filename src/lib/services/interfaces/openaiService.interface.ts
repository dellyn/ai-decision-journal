import { DecisionAnalysis } from '@/entities/decision';

export interface IOpenAIService {
  analyzeDecision(
    situation: string,
    decision: string,
    reasoning?: string
  ): Promise<DecisionAnalysis>;
} 