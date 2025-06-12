export enum DecisionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error',
}

export type DecisionStatus = 'pending' | 'processing' | 'done' | 'error';

export type DecisionCategory = 'Emotional' | 'Strategic' | 'Impulsive' | 'Rational';

export interface Bias {
  name: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  explanation: string;
}

export type DecisionAnalysis = {
  category: DecisionCategory;
  biases: Bias[];
  suggestions: string[];
  score: number;
};

export interface Decision {
  id: string;
  situation: string;
  decision: string;
  reasoning?: string;
  analysis?: DecisionAnalysis;
  createdAt: string;
  updatedAt: string;
}

export type DecisionResponse = Omit<Decision, 'userId'>

export interface DecisionFormData {
  situation: string;
  decision: string;
  reasoning?: string;
} 