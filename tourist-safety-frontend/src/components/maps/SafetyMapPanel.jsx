import { useEffect, useMemo, useState } from 'react';
import { FiLayers, FiMapPin, FiNavigation } from 'react-icons/fi';
import GoogleMapView from './GoogleMapView';
import { mapService } from '../../services/mapService';
import { safetyService } from '../../services/safetyService';

const LAYERS = [
  { id: 'heatmap', label: 'Risk heatmap', color: 'bg-rose-500' },
  { id: 'geofence', label: 'GeoFence alerts', color: 'bg-amber-500' },
  { id: 'safePlaces', label: 'Safe places', color: 'bg-emerald-500' },
  { id: 'myLocation', label: 'My location', color: 'bg-brand-500' },
];

const defaultCenter = { lat: 15.2993, lng: 74.124 };

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

export default function SafetyMapPanel({ height = '520px' }) {
  const [heatmap, setHeatmap] = useState(null);
  const [safePlaces, setSafePlaces] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState({
    heatmap: true,
    geofence: true,
    safePlaces: false,
    myLocation: true,
  });

  useEffect(() => {
    Promise.allSettled([
      mapService.getHeatmap(),
      mapService.getSafePlaces(),
      safetyService.getGeofenceAlerts(),
    ]).then(([heatmapRes, placesRes, alertsRes]) => {
      if (heatmapRes.status === 'fulfilled') setHeatmap(heatmapRes.value);
      if (placesRes.status === 'fulfilled') setSafePlaces(placesRes.value);
      if (alertsRes.status === 'fulfilled') setAlerts(asArray(alertsRes.value));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation || !layers.myLocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserPosition(null),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [layers.myLocation]);

  const markers = useMemo(() => {
    const items = [];

    if (layers.geofence) {
      alerts.forEach((alert) => {
        if (alert.lat != null && alert.lng != null) {
          items.push({
            id: `alert-${alert.id}`,
            lat: alert.lat,
            lng: alert.lng,
            label: `${alert.zone} (${alert.level} risk)`,
            type: 'alert',
          });
        }
      });
    }

    if (layers.safePlaces && safePlaces?.markers) {
      safePlaces.markers.forEach((place) => {
        items.push({
          id: place.id,
          lat: place.lat,
          lng: place.lng,
          label: place.label,
          type: 'safe',
        });
      });
    }

    if (layers.myLocation && userPosition) {
      items.push({
        id: 'user-location',
        lat: userPosition.lat,
        lng: userPosition.lng,
        label: 'Your location',
        type: 'user',
      });
    }

    return items;
  }, [alerts, safePlaces, layers, userPosition]);

  const mapCenter = useMemo(() => {
    if (layers.myLocation && userPosition) return userPosition;
    if (heatmap?.center) return heatmap.center;
    if (markers.length > 0) return { lat: markers[0].lat, lng: markers[0].lng };
    return defaultCenter;
  }, [heatmap, markers, userPosition, layers.myLocation]);

  const toggleLayer = (id) => {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleHeatmap = layers.heatmap ? heatmap?.heatmapData ?? [] : [];

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-brand-600" size={18} />
            <h3 className="font-semibold text-slate-900 dark:text-white">Safety map</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Live risk zones, geofence alerts, and verified safe places near you.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => toggleLayer(layer.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                layers[layer.id]
                  ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${layer.color}`} />
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {loading ? (
          <div
            className="flex items-center justify-center bg-slate-100 dark:bg-slate-900"
            style={{ height }}
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : (
          <GoogleMapView
            height={height}
            center={mapCenter}
            zoom={layers.myLocation && userPosition ? 13 : 11}
            markers={markers}
            heatmapData={visibleHeatmap}
            showHeatmap={layers.heatmap}
            rounded
          />
        )}

        {/* Map legend overlay */}
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-card backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <FiLayers size={12} />
            Legend
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Low risk zone
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Medium risk zone
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              High risk zone
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
              Your location
            </li>
          </ul>
        </div>

        {layers.myLocation && !userPosition && !loading && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
            <FiNavigation size={14} />
            Location access unavailable — showing default region
          </div>
        )}
      </div>
    </div>
  );
}
