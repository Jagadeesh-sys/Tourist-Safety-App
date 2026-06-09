import { apiClient } from '../api/apiClient';

export const officerService = {
  getCases: async () => {
    const { data } = await apiClient.get('/officer/cases');
    return data;
  },
  getStats: async () => {
    const { data } = await apiClient.get('/officer/stats');
    return data;
  },
};
