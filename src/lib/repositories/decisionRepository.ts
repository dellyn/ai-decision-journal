import { createClient } from "@/lib/supabase/server";
import { Decision, DecisionFormData, DecisionStatus } from "@/entities/decision";

export interface DecisionRecord extends Decision {
  userId: string;
}

async function getClient() {
  return await createClient();
}

export async function createDecision(data: DecisionFormData, userId: string): Promise<DecisionRecord> {
  const supabase = await getClient();
  
  const { data: decision, error } = await supabase
    .from("decisions")
    .insert({
      userId,
      situation: data.situation,
      decision: data.decision,
      reasoning: data.reasoning,
      status: DecisionStatus.PROCESSING,
    })
    .select()
    .single();

  if (error?.message) {
    console.error("Supabase error:", error);
    throw new Error(error.message || "Failed to create decision");
  }

  if (!decision) {
    throw new Error("No decision data returned");
  }

  return decision;
}

export async function updateDecisionStatus(
  decisionId: string, 
  status: DecisionRecord["status"]
): Promise<void> {
  const supabase = await getClient();
  
  const { error } = await supabase
    .from("decisions")
    .update({ status })
    .eq("id", decisionId);

  if (error?.message) {
    console.error("Supabase error:", error);
    throw new Error(error.message || `Failed to update decision status to ${status}`);
  }
}

export async function updateDecisionAnalysis(
  decisionId: string, 
  analysis: DecisionRecord["analysis"]
): Promise<void> {
  const supabase = await getClient();
  
  const { error } = await supabase
    .from("decisions")
    .update({ 
      status: "done",
      analysis 
    })
    .eq("id", decisionId);

  if (error?.message) {
    console.error("Failed to update decision analysis:", {
      decisionId,
      analysis,
      error: error.message
    });
    throw new Error(error.message || "Failed to update decision analysis");
  }

  console.log("Successfully updated decision analysis:", {
    decisionId,
    status: "done"
  });
}

export async function updateDecision(
  decisionId: string,
  data: Partial<DecisionRecord>
): Promise<DecisionRecord> {
  const supabase = await getClient();
  
  const { data: decision, error } = await supabase
    .from("decisions")
    .update(data)
    .eq("id", decisionId)
    .select()
    .single();

  if (error?.message) {
    console.error("Supabase error:", error);
    throw new Error(error.message || "Failed to update decision");
  }

  if (!decision) {
    throw new Error("Decision not found");
  }

  return decision;
}

export interface PaginatedDecisions {
  data: DecisionRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getDecisions(
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedDecisions> {
  const supabase = await getClient();
  
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("decisions")
    .select("*", { count: "exact" })
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .range(from, to);

  if (error?.message) {
    console.error("Supabase error:", error);
    throw new Error(error.message || "Failed to fetch decisions");
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    pageSize
  };
}

export async function getDecisionById(id: string): Promise<Omit<DecisionRecord, "userId">> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from("decisions")
    .select("id, situation, decision, reasoning, status, analysis, createdAt, updatedAt")
    .eq("id", id)
    .single();

  if (error?.message) {
    console.error("Supabase error:", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Decision not found");
  }

  return data;
}