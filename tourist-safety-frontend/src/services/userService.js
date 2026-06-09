import { apiClient } from '../api/apiClient';

const unwrap = (payload) => {
  if (payload?.data !== undefined) return payload.data;
  if (payload !== undefined) return payload;
  return null;
};

export const userService = {
  getAll: async () => {
    const { data } = await apiClient.get('/admin/users');
    return unwrap(data);
  },
  getProfile: async () => {
    const { data } = await apiClient.get('/users/me');
    return unwrap(data);
  },
  updateProfile: async (profile) => {
    const { data } = await apiClient.put('/users/me', profile);
    return unwrap(data);
  },
};
