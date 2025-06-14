export type { DecisionFormData } from './schema';

export enum DecisionStatus {
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error',
}

export type DecisionCategory = string

export interface Bias {
  name: string;
  description: string;
  evidence: string;
}

export type DecisionAnalysis = {
  title?: string; // AI generated summary of the situation
  category: DecisionCategory;
  alternatives: string[];
  biases: Bias[];
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
  lastProcessedAt?: string;
}

