import { STORAGE_KEYS } from '../utils/constants';
import { createSeedDatabase } from './seedData';

const DB_KEY = 'tourist_safety_db';
const DB_VERSION = 11;

export function getDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const seed = createSeedDatabase();
      saveDb(seed);
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (parsed._version !== DB_VERSION) {
      const seed = createSeedDatabase();
      saveDb(seed);
      return seed;
    }
    return parsed;
  } catch {
    const seed = createSeedDatabase();
    saveDb(seed);
    return seed;
  }
}

export function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify({ ...db, _version: DB_VERSION }));
}

export function nextId(items) {
  if (!items?.length) return 1;
  return Math.max(...items.map((x) => Number(x.id) || 0)) + 1;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function computeSafetyStats(db, userEmail) {
  const userIncidents = db.incidents.filter((i) => !userEmail || i.userEmail === userEmail);
  const userSos = db.sos.filter((s) => !userEmail || s.userEmail === userEmail);
  const activeAlerts = db.geofenceAlerts.length;
  const trips = db.trips.filter((t) => !userEmail || t.userEmail === userEmail);
  const avgScore = trips.length
    ? Math.round(trips.reduce((s, t) => s + (t.safetyScore || 80), 0) / trips.length)
    : 85;

  return {
    safetyScore: avgScore,
    activeAlerts,
    incidentsThisMonth: userIncidents.length,
    sosCount: userSos.filter((s) => s.status === 'active').length,
  };
}

export function computeAnalytics(db) {
  const destinations = [...new Set(db.trips.map((t) => t.destination?.split(',')[0]?.trim()).filter(Boolean))];
  return {
    totalTrips: db.trips.length,
    activeTourists: db.users.filter((u) => u.role === 'TOURIST' && u.status === 'active').length,
    sosRequests: db.sos.length,
    incidents: db.incidents.length,
    safetyScore: computeSafetyStats(db).safetyScore,
    popularDestinations: destinations.length ? destinations : db.destinations.map((d) => d.name),
  };
}

export function computeChartData(db) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const tripCounts = months.map((_, i) => db.trips.filter((t) => new Date(t.startDate).getMonth() === i).length + 1);

  const types = ['theft', 'harassment', 'accident', 'lost', 'other'];
  const incidentCounts = types.map((type) =>
    db.incidents.filter((inc) => inc.type === type || (type === 'other' && !types.slice(0, 4).includes(inc.type))).length,
  );

  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const regionScores = regions.map((_, i) => 75 + ((db.heatmapPoints[i]?.weight ?? 0.5) * 20));

  return {
    tripsTrend: { labels: months, values: tripCounts },
    incidentTypes: { labels: ['Theft', 'Harassment', 'Accident', 'Lost', 'Other'], values: incidentCounts },
    safetyByRegion: { labels: regions, values: regionScores.map((v) => Math.round(v)) },
  };
}

export function validateUserLogin(db, email, password) {
  const normalized = email?.toLowerCase()?.trim();
  if (!normalized || !password) return null;
  const user = db.users.find((u) => u.email === normalized);
  if (!user || user.password !== password) return null;
  return {
    email: user.email,
    name: user.name,
    role: (user.role || 'TOURIST').toUpperCase(),
  };
}
