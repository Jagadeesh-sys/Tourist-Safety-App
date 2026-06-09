import { apiClient } from '../api/apiClient';

const SAMPLE_TRIPS = [
  {
    id: 1,
    title: 'Golden Triangle Adventure',
    destination: 'Delhi, Agra, Jaipur',
    startDate: '2025-12-15',
    endDate: '2025-12-22',
    status: 'planned',
    safetyScore: 88,
    notes: 'Visit Taj Mahal, Red Fort, and Amer Fort.',
  },
  {
    id: 2,
    title: 'Goa Beach Holiday',
    destination: 'Goa',
    startDate: '2026-01-20',
    endDate: '2026-01-27',
    status: 'planned',
    safetyScore: 92,
    notes: 'Relax at Colva Beach and explore local cuisine.',
  },
];

function normalizeTrip(trip) {
  if (!trip) return trip;
  return {
    ...trip,
    status: (trip.status || 'planned').toLowerCase(),
    safetyScore: trip.safetyScore ?? 85,
  };
}

function normalizeTrips(data) {
  const list = Array.isArray(data) ? data : data?.content ?? data?.data ?? [];
  return Array.isArray(list) ? list.map(normalizeTrip) : [];
}

export const tripService = {
  getMyTrips: async () => {
    try {
      const { data } = await apiClient.get('/trips/my');
      const normalized = normalizeTrips(data);
      return normalized.length > 0 ? normalized : SAMPLE_TRIPS;
    } catch (err) {
      console.log('Using sample trips');
      return SAMPLE_TRIPS;
    }
  },

  getById: async (id) => {
    try {
      const { data } = await apiClient.get(`/trips/${id}`);
      return normalizeTrip(data);
    } catch (err) {
      const sample = SAMPLE_TRIPS.find((t) => String(t.id) === String(id));
      if (sample) return normalizeTrip(sample);
      // If not found, return first sample trip
      return normalizeTrip(SAMPLE_TRIPS[0]);
    }
  },

  create: async (trip) => {
    const { data } = await apiClient.post('/trips', {
      ...trip,
      status: trip.status || 'planned',
    });
    return normalizeTrip(data);
  },

  update: (id, trip) => apiClient.put(`/trips/${id}`, trip),

  remove: (id) => apiClient.delete(`/trips/${id}`),

  getAllAdmin: async () => {
    const { data } = await apiClient.get('/admin/trips');
    return normalizeTrips(data);
  },
};
