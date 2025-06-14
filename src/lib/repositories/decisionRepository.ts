import { createClient } from "@/lib/supabase/server";
import { Decision, DecisionFormData, DecisionStatus } from "@/entities/decision";
import { IDecisionRepository } from "./interfaces/decisionRepository.interface";
import { DatabaseError, NotFoundError, ConflictError, ForbiddenError } from "@/shared/errors/domain.error";

export interface DecisionRecord extends Decision {
  userId?: string;
}

export class DecisionRepository implements IDecisionRepository {
  private async getClient() {
    return await createClient();
  }

  async create(data: DecisionFormData, userId: string): Promise<DecisionRecord> {
    try {
      const supabase = await this.getClient();
      
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
        throw new DatabaseError(error.message);
      }

      if (!decision) {
        throw new DatabaseError("No decision data returned");
      }

      return decision;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to create decision");
    }
  }

  async findById(id: string): Promise<DecisionRecord> {
    try {
      const supabase = await this.getClient();
      
      const { data, error } = await supabase
        .from("decisions")
        .select("id, situation, decision, reasoning, status, analysis, createdAt, updatedAt, lastProcessedAt")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          throw new NotFoundError("Decision not found");
        }
        if (error.code === "42501") {
          throw new ForbiddenError("Unauthorized access to decision");
        }
        if (error.code === "23505") {
          throw new ConflictError("Decision already exists");
        }
        console.error("[Database Error]", {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw new DatabaseError("Database error occurred");
      }

      if (!data) {
        throw new NotFoundError("Decision not found");
      }

      return data;
    } catch (error) {
      if (error instanceof DatabaseError || 
          error instanceof NotFoundError || 
          error instanceof ForbiddenError || 
          error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError("Failed to fetch decision");
    }
  }

  async update(id: string, data: Partial<DecisionRecord>): Promise<DecisionRecord> {
    try {
      const supabase = await this.getClient();
      
      const { data: decision, error } = await supabase
        .from("decisions")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error?.message) {
        console.error("Supabase error:", error);
        throw new DatabaseError(error.message);
      }

      if (!decision) {
        throw new NotFoundError("Decision not found");
      }

      return decision;
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Failed to update decision");
    }
  }

  async updateStatus(id: string, status: DecisionStatus): Promise<void> {
    try {
      const supabase = await this.getClient();
      
      const { error } = await supabase
        .from("decisions")
        .update({ 
          status,
          ...(status === DecisionStatus.PROCESSING ? { lastProcessedAt: new Date().toISOString() } : {})
        })
        .eq("id", id);

      if (error?.message) {
        console.error("Supabase error:", error);
        throw new DatabaseError(error.message);
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to update decision status");
    }
  }

  async updateAnalysis(id: string, analysis: Decision["analysis"]): Promise<void> {
    try {
      const supabase = await this.getClient();
      
      const { error } = await supabase
        .from("decisions")
        .update({ 
          status: "done",
          analysis 
        })
        .eq("id", id);

      if (error?.message) {
        console.error("Failed to update decision analysis:", {
          id,
          analysis,
          error: error.message
        });
        throw new DatabaseError(error.message);
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to update decision analysis");
    }
  }

  async findAll(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: DecisionRecord[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const supabase = await this.getClient();
      
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
        throw new DatabaseError(error.message);
      }

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to fetch decisions");
    }
  }

  async resetProcessing(id: string): Promise<void> {
    try {
      const supabase = await this.getClient();
      
      const { error } = await supabase
        .from("decisions")
        .update({ 
          lastProcessedAt: null,
          status: DecisionStatus.PROCESSING
        })
        .eq("id", id);

      if (error?.message) {
        console.error("Supabase error:", error);
        throw new DatabaseError(error.message);
      }
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to reset decision processing");
    }
  }
}