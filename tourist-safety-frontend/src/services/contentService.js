import { apiClient } from '../api/apiClient';

export const contentService = {
  getLanding: async () => {
    const { data } = await apiClient.get('/public/landing');
    return data;
  },
};
