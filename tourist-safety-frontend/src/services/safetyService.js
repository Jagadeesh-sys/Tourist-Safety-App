import { apiClient } from '../api/apiClient';

const unwrap = (payload) => {
  // Handle various response structures
  if (payload?.data !== undefined) return payload.data;
  if (payload !== undefined) return payload;
  return null;
};

export const safetyService = {
  triggerSOS: async (payload) => {
    const { data } = await apiClient.post('/sos', payload);
    return unwrap(data);
  },
  getSOSHistory: async () => {
    const { data } = await apiClient.get('/sos/my');
    const result = unwrap(data);
    return Array.isArray(result) ? result : [];
  },
  getActiveSOS: async () => {
    const { data } = await apiClient.get('/sos/active');
    const result = unwrap(data);
    return Array.isArray(result) ? result : [];
  },
  getAdminSOS: async () => {
    const { data } = await apiClient.get('/admin/sos');
    const result = unwrap(data);
    return Array.isArray(result) ? result : [];
  },
  reportIncident: async (payload) => {
    const { data } = await apiClient.post('/incidents', payload);
    return unwrap(data);
  },
  getIncidents: async () => {
    const { data } = await apiClient.get('/incidents/my');
    return unwrap(data);
  },
  getAllIncidents: async () => {
    const { data } = await apiClient.get('/incidents');
    return unwrap(data);
  },
  getGeofenceAlerts: async () => {
    const { data } = await apiClient.get('/geofence/alerts');
    const result = unwrap(data);
    return Array.isArray(result) ? result : [];
  },
  getGeofenceZones: async () => {
    const { data } = await apiClient.get('/geofence/zones');
    const result = unwrap(data);
    return Array.isArray(result) ? result : [];
  },
  getSafetyStats: async () => {
    const { data } = await apiClient.get('/safety/stats');
    return unwrap(data);
  },
};
