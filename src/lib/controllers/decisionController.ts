import { DecisionRecord } from '@/lib/repositories/decisionRepository';
import { analyzeDecision } from '@/lib/services/openaiService';
import { updateDecisionStatus, updateDecisionAnalysis, resetDecisionProcessing } from '@/lib/repositories/decisionRepository';
import { DecisionStatus } from '@/entities/decision';
import { ApiError, createApiError } from '@/shared/api/error-handler';

const PROCESSING_TIMEOUT = 120000; // 120 seconds

async function checkProcessingTimeout(decision: DecisionRecord): Promise<void> {
  if (!decision.lastProcessedAt) return;

  const processingStart = new Date(decision.lastProcessedAt).getTime();
  const now = new Date().getTime();
  const processingTime = now - processingStart;

  if (processingTime > PROCESSING_TIMEOUT) {
    console.log('Decision processing timed out:', {
      decisionId: decision.id,
      processingTime,
      lastProcessedAt: decision.lastProcessedAt
    });
    await updateDecisionStatus(decision.id, DecisionStatus.ERROR);
    throw new ApiError(408, 'Decision processing timed out');
  }
}

export async function processDecision(decision: DecisionRecord): Promise<void> {
  console.log('Starting decision processing:', { decisionId: decision.id });
  
  try {
    // Reset processing state before starting new analysis
    await resetDecisionProcessing(decision.id);
    
    await checkProcessingTimeout(decision);
    await updateDecisionStatus(decision.id, DecisionStatus.PROCESSING);
    console.log('Updated decision status to processing:', { decisionId: decision.id });

    const analysis = await analyzeDecision(
      decision.situation,
      decision.decision,
      decision.reasoning
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
    throw createApiError(error);
  }
}