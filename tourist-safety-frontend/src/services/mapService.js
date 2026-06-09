import { apiClient } from '../api/apiClient';

export const mapService = {
  getHeatmap: async () => {
    const { data } = await apiClient.get('/maps/heatmap');
    return data;
  },
  getSOSMarkers: async () => {
    const { data } = await apiClient.get('/maps/sos');
    return data;
  },
  getSafePlaces: async () => {
    const { data } = await apiClient.get('/maps/safe-places');
    return data;
  },
};
