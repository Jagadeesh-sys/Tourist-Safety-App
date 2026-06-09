import { apiClient } from '../api/apiClient';

export const notificationService = {
  getAll: async () => {
    const { data } = await apiClient.get('/notifications');
    return data;
  },
};
