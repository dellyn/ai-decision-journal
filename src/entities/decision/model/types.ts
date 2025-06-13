export type { DecisionFormData } from './schema';

export enum DecisionStatus {
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error',
}

export type DecisionCategory = 'Emotional' | 'Strategic' | 'Impulsive' | 'Rational';

export interface Bias {
  name: string;
  description: string;
  evidence: string;
}

export type DecisionAnalysis = {
  category: DecisionCategory;
  alternatives: string[];
  biases: Bias[];
  suggestions: string[];
};

export interface Decision {
  id: string;
  status: DecisionStatus;
  situation: string;
  decision: string;
  reasoning?: string;
  analysis?: DecisionAnalysis;
  createdAt: string;
  updatedAt: string;
}

export type DecisionResponse = Omit<Decision, 'userId'>

