import { DecisionFormData, DecisionStatus } from "@/entities/decision";
import { DecisionRecord } from "@/lib/repositories/decisionRepository";
import { IDecisionService } from "./interfaces/decisionService.interface";
import { IDecisionRepository } from "../repositories/interfaces/decisionRepository.interface";
import { DatabaseError } from "@/shared/errors/domain.error";
import { analyzeDecision } from "./openaiService";

const PROCESSING_TIMEOUT_MS = 120 * 1000; // 120 seconds

export class DecisionService implements IDecisionService {
  constructor(private readonly repository: IDecisionRepository) {}

  private async handleStaleProcessingDecision(decision: DecisionRecord): Promise<DecisionRecord> {
    if (
      decision.status === DecisionStatus.PROCESSING &&
      decision.lastProcessedAt &&
      Date.now() - new Date(decision.lastProcessedAt).getTime() > PROCESSING_TIMEOUT_MS
    ) {
      await this.repository.updateStatus(decision.id, DecisionStatus.ERROR);
      return {
        ...decision,
        status: DecisionStatus.ERROR
      };
    }
    return decision;
  }

  async createDecision(data: DecisionFormData, userId: string): Promise<DecisionRecord> {
    try {
      const decision = await this.repository.create(data, userId);
      
      // Start processing in the background
      this.processDecision(decision).catch((error) => {
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
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to create decision");
    }
  }

  async getDecisionById(id: string): Promise<DecisionRecord> {
    try {
      const decision = await this.repository.findById(id);
      return this.handleStaleProcessingDecision(decision);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to fetch decision");
    }
  }

  async updateDecision(id: string, data: Partial<DecisionRecord>): Promise<DecisionRecord> {
    try {
      const updatedDecision = await this.repository.update(id, data);
      
      if (data.status === DecisionStatus.PROCESSING) {
        this.processDecision(updatedDecision).catch(console.error);
      }
      
      return updatedDecision;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to update decision");
    }
  }

  async updateDecisionStatus(id: string, status: DecisionStatus): Promise<void> {
    try {
      await this.repository.updateStatus(id, status);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to update decision status");
    }
  }

  async updateDecisionAnalysis(id: string, analysis: DecisionRecord["analysis"]): Promise<void> {
    try {
      await this.repository.updateAnalysis(id, analysis);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to update decision analysis");
    }
  }

  async getDecisions(
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
      const result = await this.repository.findAll(userId, page, pageSize);
      
      // Handle stale processing decisions
      const updatedData = await Promise.all(
        result.data.map(decision => this.handleStaleProcessingDecision(decision))
      );

      return {
        ...result,
        data: updatedData
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to fetch decisions");
    }
  }

  async resetDecisionProcessing(id: string): Promise<void> {
    try {
      await this.repository.resetProcessing(id);
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to reset decision processing");
    }
  }

  async processDecision(decision: DecisionRecord): Promise<void> {
    try {
      await this.repository.updateStatus(decision.id, DecisionStatus.PROCESSING);
      
      const analysis = await analyzeDecision(
        decision.situation,
        decision.decision,
        decision.reasoning
      );

      await this.repository.updateAnalysis(decision.id, analysis);
    } catch (error) {
      console.error("Error processing decision:", error);
      await this.repository.updateStatus(decision.id, DecisionStatus.ERROR);
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to process decision");
    }
  }
}
