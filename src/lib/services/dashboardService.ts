import { IDashboardService, DecisionAnalytics } from "./interfaces/dashboardService.interface";
import { IDecisionRepository } from "../repositories/interfaces/decisionRepository.interface";
import { DatabaseError } from "@/shared/errors/domain.error";

export class DashboardService implements IDashboardService {
  constructor(private readonly repository: IDecisionRepository) {}

  async getAnalytics(userId: string): Promise<DecisionAnalytics> {
    try {
      const { data: decisions } = await this.repository.findAll(userId, 1, 1000);

      const categories = new Map<string, number>();
      const biases = new Map<string, number>();
      let totalProcessingTime = 0;
      let processedDecisions = 0;

      decisions.forEach(decision => {
        if (decision.analysis) {
          const category = decision.analysis.category;
          categories.set(category, (categories.get(category) || 0) + 1);

          decision.analysis.biases.forEach(bias => {
            const normalizedBias = this.normalizeBiasName(bias.name);
            biases.set(normalizedBias, (biases.get(normalizedBias) || 0) + 1);
          });

          if (decision.lastProcessedAt && decision.createdAt) {
            const processingTime = new Date(decision.lastProcessedAt).getTime() - new Date(decision.createdAt).getTime();
            totalProcessingTime += processingTime;
            processedDecisions++;
          }
        }
      });

      return {
        categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count })),
        biases: Array.from(biases.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10), // Top 10 biases
        totalDecisions: decisions.length,
        averageProcessingTime: processedDecisions > 0 ? totalProcessingTime / processedDecisions : 0
      };
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError("Failed to fetch dashboard analytics");
    }
  }

  // Just a demo to normalize the bias name
  private normalizeBiasName(biasName: string): string {
    const name = biasName.toLowerCase();
    
    if (name.includes('action bias')) return 'Action Bias';
    if (name.includes('confirmation bias')) return 'Confirmation Bias';
    if (name.includes('solution confirmation')) return 'Confirmation Bias';
    if (name.includes('tit-for-tat')) return 'Tit-for-Tat';
    if (name.includes('planning fallacy')) return 'Planning Fallacy';
    
    return biasName; 
  }
} 