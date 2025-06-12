import { httpClient } from './client';
import { Decision } from '../types/decision';
import { ApiRoutes } from '@/shared/api/routes';

export const decisionsApi = {
  async getDecisions(page: number = 1, pageSize: number = 10) {
    return httpClient<{ data: Decision[] }>(`${ApiRoutes.DECISIONS}?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });
  },

  async getDecisionById(id: string) {
    return httpClient<Decision>(`${ApiRoutes.DECISIONS}/${id}`, {
      method: 'GET',
    });
  },

  async createDecision(data: Omit<Decision, 'id' | 'status' | 'analysis' | 'createdAt'>) {
    return httpClient<Decision>(ApiRoutes.DECISIONS, {
      method: 'POST',
      body: data,
    });
  },

  async retryAnalysis(id: string) {
    return httpClient<Decision>(`${ApiRoutes.DECISIONS}/${id}/retry`, {
      method: 'PATCH',
    });
  },
}; 