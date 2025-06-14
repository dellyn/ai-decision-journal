import { DecisionRecord } from '@/lib/repositories/decisionRepository';
import { analyzeDecision } from '@/lib/services/openaiService';
import { updateDecisionStatus, updateDecisionAnalysis } from '@/lib/repositories/decisionRepository';
import { DecisionStatus } from '@/entities/decision';
import { withTimeout } from '@/shared/utils/timeout';

const PROCESSING_TIMEOUT = 60000; // 60 seconds

export async function processDecision(decision: DecisionRecord): Promise<void> {
  try {
    await updateDecisionStatus(decision.id, DecisionStatus.PROCESSING);

    const analysis = await withTimeout(
      analyzeDecision(
        decision.situation,
        decision.decision,
        decision.reasoning
      ),
      PROCESSING_TIMEOUT,
      'Decision analysis timed out'
    );
    console.log('analysis', analysis);
    await updateDecisionAnalysis(decision.id, analysis);
  } catch (error) {
    console.error('Error processing decision:', error);
    await updateDecisionStatus(decision.id, DecisionStatus.ERROR);
    throw error;
  }
}