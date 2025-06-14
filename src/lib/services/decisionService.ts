import { DecisionFormData } from "@/entities/decision";
import { DecisionRecord, createDecision } from "@/lib/repositories/decisionRepository";
import { processDecision } from "@/lib/controllers/decisionController";

export async function createDecisionWithProcessing(
  data: DecisionFormData, 
  userId: string
): Promise<DecisionRecord> {
  console.log('Creating decision with processing:', { userId });
  
  const decision = await createDecision(data, userId);
  console.log('Decision created:', { decisionId: decision.id });
  
  processDecision(decision).catch((error) => {
    console.error('Background processing failed:', {
      decisionId: decision.id,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
  });
  
  return decision;
}
