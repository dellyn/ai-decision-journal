import { createClient } from "@/lib/supabase/server";
import { Decision, DecisionFormData, DecisionStatus } from "@/entities/decision";
import { ApiError, createApiError } from "@/shared/api/error-handler";

export interface DecisionRecord extends Decision {
  userId: string;
}

async function getClient() {
  return await createClient();
}

export async function createDecision(data: DecisionFormData, userId: string): Promise<DecisionRecord> {
  try {
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
      throw new ApiError(500, error.message);
    }

    if (!decision) {
      throw new ApiError(500, "No decision data returned");
    }

    return decision;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function updateDecisionStatus(
  decisionId: string, 
  status: DecisionRecord["status"]
): Promise<void> {
  try {
    const supabase = await getClient();
    
    const { error } = await supabase
      .from("decisions")
      .update({ 
        status,
        ...(status === DecisionStatus.PROCESSING ? { lastProcessedAt: new Date().toISOString() } : {})
      })
      .eq("id", decisionId);

    if (error?.message) {
      console.error("Supabase error:", error);
      throw new ApiError(500, error.message);
    }
  } catch (error) {
    throw createApiError(error);
  }
}

export async function updateDecisionAnalysis(
  decisionId: string, 
  analysis: DecisionRecord["analysis"]
): Promise<void> {
  try {
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
      throw new ApiError(500, error.message);
    }

    console.log("Successfully updated decision analysis:", {
      decisionId,
      status: "done"
    });
  } catch (error) {
    throw createApiError(error);
  }
}

export async function updateDecision(
  decisionId: string,
  data: Partial<DecisionRecord>
): Promise<DecisionRecord> {
  try {
    const supabase = await getClient();
    
    const { data: decision, error } = await supabase
      .from("decisions")
      .update(data)
      .eq("id", decisionId)
      .select()
      .single();

    if (error?.message) {
      console.error("Supabase error:", error);
      throw new ApiError(500, error.message);
    }

    if (!decision) {
      throw new ApiError(404, "Decision not found");
    }

    return decision;
  } catch (error) {
    throw createApiError(error);
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
  try {
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
      throw new ApiError(500, error.message);
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    throw createApiError(error);
  }
}

export async function getDecisionById(id: string): Promise<Omit<DecisionRecord, "userId">> {
  try {
    const supabase = await getClient();
console.log({id})
    const { data, error } = await supabase
      .from("decisions")
      .select("id, situation, decision, reasoning, status, analysis, createdAt, updatedAt, lastProcessedAt")
      .eq("id", id)
      .single();

    if (error?.message) {
      console.error("Supabase error:", error);
      throw new ApiError(500, error.message);
    }

    if (!data) {
      throw new ApiError(404, "Decision not found");
    }

    return data;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function resetDecisionProcessing(decisionId: string): Promise<void> {
  try {
    const supabase = await getClient();
    
    const { error } = await supabase
      .from("decisions")
      .update({ 
        lastProcessedAt: null,
        status: DecisionStatus.PROCESSING
      })
      .eq("id", decisionId);

    if (error?.message) {
      console.error("Supabase error:", error);
      throw new ApiError(500, error.message);
    }
  } catch (error) {
    throw createApiError(error);
  }
}