import { DecisionRecord } from '@/lib/repositories/decisionRepository';
import { analyzeDecision } from '@/lib/services/openaiService';
import { updateDecisionStatus, updateDecisionAnalysis } from '@/lib/repositories/decisionRepository';
import { DecisionStatus } from '@/entities/decision';

export async function processDecision(decision: DecisionRecord): Promise<void> {
  try {
    await updateDecisionStatus(decision.id, DecisionStatus.PROCESSING);

    const analysis = await analyzeDecision(
      decision.situation,
      decision.decision,
      decision.reasoning
    );

    await updateDecisionAnalysis(decision.id, analysis);
  } catch (error) {
    console.error('Decision processing error:', error);
    await updateDecisionStatus(decision.id, DecisionStatus.ERROR);
    throw error;
  }
}