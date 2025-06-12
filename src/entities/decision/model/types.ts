export type DecisionStatus = 'pending' | 'processing' | 'done' | 'error';

export type DecisionCategory = 'Emotional' | 'Strategic' | 'Impulsive' | 'Rational';

export interface Bias {
  name: string;
  description: string;
}

export type DecisionAnalysis = {
  category: DecisionCategory;
  biases: Bias[];
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

export type DecisionResponse = Omit<Decision, 'userId'>

export type CreateDecisionInput = {
  situation: string;
  decision: string;
  reasoning?: string;
}; 