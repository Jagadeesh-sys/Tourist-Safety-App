import { apiClient } from '../api/apiClient';

export const reportService = {
  getAll: async () => {
    const { data } = await apiClient.get('/admin/reports');
    return data;
  },
};
