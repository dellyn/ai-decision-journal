import { DecisionFormData } from "@/entities/decision";
import { DecisionRecord, createDecision } from "@/lib/repositories/decisionRepository";
import { processDecision } from "@/lib/controllers/decisionController";

export async function createDecisionWithProcessing(
  data: DecisionFormData, 
  userId: string
): Promise<DecisionRecord> {
  const decision = await createDecision(data, userId);
  
  processDecision(decision).catch(console.error);
  
  return decision;
}
