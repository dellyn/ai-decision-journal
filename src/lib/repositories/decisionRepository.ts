import { createClient } from "@/lib/supabase/server";
import { DecisionFormData } from "@/entities/decision";

export interface DecisionRecord {
  id: string;
  userId: string;
  situation: string;
  decision: string;
  reasoning?: string;
  status:  "processing" | "done" | "error";
  analysis?: {
    category: string;
    biases: string[];
    alternatives: string[];
  };
  createdAt: string;
  updatedAt: string;
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
      status: "processing",
    })
    .select()
    .single();

  console.log(1, decision)
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
    console.error("Supabase error:", error);
    throw new Error(error.message || "Failed to update decision analysis");
  }
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

export async function getDecisionById(id: string): Promise<DecisionRecord> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from("decisions")
    .select("*")
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