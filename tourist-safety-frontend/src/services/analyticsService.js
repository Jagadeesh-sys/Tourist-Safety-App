import { apiClient } from '../api/apiClient';

const unwrap = (payload) => {
  // Handle various response structures
  if (payload?.data !== undefined) return payload.data;
  if (payload !== undefined) return payload;
  return null;
};

export const analyticsService = {
  getDashboardMetrics: async () => {
    const { data } = await apiClient.get('/analytics/dashboard');
    return unwrap(data);
  },
  getChartData: async () => {
    const { data } = await apiClient.get('/analytics/charts');
    return unwrap(data);
  },
};
