import { apiClient } from '../api/apiClient';

export const communityService = {
  getPosts: async () => {
    const { data } = await apiClient.get('/community/posts');
    return data;
  },
  getModerationQueue: async () => {
    const { data } = await apiClient.get('/admin/community');
    return data;
  },
  createPost: async (text) => {
    const { data } = await apiClient.post('/community/posts', { text });
    return data;
  },
};
