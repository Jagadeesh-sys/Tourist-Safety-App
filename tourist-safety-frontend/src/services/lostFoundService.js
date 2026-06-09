import { apiClient } from '../api/apiClient';

export const lostFoundService = {
  getAll: async () => {
    const { data } = await apiClient.get('/lost-found');
    return data;
  },
  report: async (payload) => {
    const { data } = await apiClient.post('/lost-found', payload);
    return data;
  },
};
