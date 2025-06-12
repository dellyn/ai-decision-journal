import { DecisionFormData } from "@/entities/decision";
import { DecisionRecord, createDecision, updateDecisionStatus, updateDecisionAnalysis } from "@/lib/repositories/decisionRepository";

export async function createDecisionWithProcessing(
  data: DecisionFormData, 
  userId: string
): Promise<DecisionRecord> {
  const decision = await createDecision(data, userId);
  
  // Start background processing
  processDecision(decision.id).catch(console.error);
  
  return decision;
}

async function processDecision(decisionId: string): Promise<void> {
  try {
    await updateDecisionStatus(decisionId, "processing");

    // TODO: Implement actual LLM processing here
    // For now, just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock analysis result
    const mockAnalysis = {
      category: "Strategic",
      biases: ["confirmation bias"],
      alternatives: ["Wait 1 day"]
    };

    await updateDecisionAnalysis(decisionId, mockAnalysis);
  } catch {
    await updateDecisionStatus(decisionId, "error");
  }
}
