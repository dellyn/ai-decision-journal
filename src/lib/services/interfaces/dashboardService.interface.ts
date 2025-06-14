
export interface DecisionAnalytics {
  categories: {
    name: string;
    count: number;
  }[];
  biases: {
    name: string;
    count: number;
  }[];
  totalDecisions: number;
  averageProcessingTime: number;
}

export interface IDashboardService {
  getAnalytics(userId: string): Promise<DecisionAnalytics>;
} 