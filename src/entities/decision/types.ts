export type DecisionStatus = 'pending' | 'processing' | 'done' | 'error';

export type DecisionCategory = 'Emotional' | 'Strategic' | 'Impulsive' | 'Rational';

export type DecisionAnalysis = {
  category: DecisionCategory;
  biases: string[];
  alternatives: string[];
};

export type Decision = {
  id: string;
  userId: string;
  situation: string;
  decision: string;
  reasoning?: string;
  status: DecisionStatus;
  analysis?: DecisionAnalysis;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDecisionInput = {
  situation: string;
  decision: string;
  reasoning?: string;
}; 