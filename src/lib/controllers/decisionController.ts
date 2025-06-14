import { DecisionRecord } from '@/lib/repositories/decisionRepository';
import { analyzeDecision } from '@/lib/services/openaiService';
import { updateDecisionStatus, updateDecisionAnalysis } from '@/lib/repositories/decisionRepository';
import { DecisionStatus } from '@/entities/decision';
import { withTimeout } from '@/shared/utils/timeout';

const PROCESSING_TIMEOUT = 120000; // 120 seconds

export async function processDecision(decision: DecisionRecord): Promise<void> {
  console.log('Starting decision processing:', { decisionId: decision.id });
  
  try {
    await updateDecisionStatus(decision.id, DecisionStatus.PROCESSING);
    console.log('Updated decision status to processing:', { decisionId: decision.id });

    const analysis = await withTimeout(
      analyzeDecision(
        decision.situation,
        decision.decision,
        decision.reasoning
      ),
      PROCESSING_TIMEOUT,
      'Decision analysis timed out after 120 seconds'
    );
    
    console.log('Analysis completed successfully:', { 
      decisionId: decision.id,
      analysis: {
        category: analysis.category,
        biasesCount: analysis.biases.length,
        alternativesCount: analysis.alternatives.length,
        suggestionsCount: analysis.suggestions.length
      }
    });

    await updateDecisionAnalysis(decision.id, analysis);
    console.log('Successfully updated decision with analysis:', { decisionId: decision.id });
  } catch (error) {
    console.error('Error processing decision:', {
      decisionId: decision.id,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    
    await updateDecisionStatus(decision.id, DecisionStatus.ERROR);
    throw error;
  }
}