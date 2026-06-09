import { useMemo, useState, useEffect } from 'react';
import { Circle, GoogleMap, Marker, Polyline, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { FiAlertCircle, FiMapPin } from 'react-icons/fi';

const LOADER_ID = 'tourist-safety-google-maps';
const defaultCenter = { lat: 15.2993, lng: 74.124 };

const MARKER_COLORS = {
  alert: '#f43f5e',
  safe: '#10b981',
  sos: '#dc2626',
  user: '#0891b2',
  default: '#6366f1',
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '200px',
};

function MapPlaceholder({ height, children }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-brand-50 p-8 text-center dark:from-slate-900 dark:to-slate-800"
      style={{ height, minHeight: height }}
    >
      {children}
    </div>
  );
}

function getMarkerIcon(type) {
  if (typeof window === 'undefined' || !window.google?.maps) return undefined;
  return {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: MARKER_COLORS[type] || MARKER_COLORS.default,
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: '#ffffff',
    scale: type === 'user' ? 11 : 9,
  };
}

function heatColor(weight) {
  if (weight > 0.7) return '#f43f5e';
  if (weight > 0.4) return '#f59e0b';
  return '#10b981';
}

export default function GoogleMapView({
  center = defaultCenter,
  zoom = 12,
  height = '360px',
  markers = [],
  heatmapData = [],
  showHeatmap = true,
  className = '',
  rounded = false,
  polyline = null,
  directions = null, // New prop for directions
  onDirectionsLoaded = null, // New callback for directions loaded
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [directionsResponse, setDirectionsResponse] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: LOADER_ID,
    googleMapsApiKey: apiKey || '',
    preventGoogleFontsLoading: true,
    libraries: ['places'], // Might need this later
  });

  // Fetch directions when directions prop changes
  useEffect(() => {
    if (!isLoaded || !directions || !directions.origin || !directions.destination) {
      setDirectionsResponse(null);
      if (onDirectionsLoaded) onDirectionsLoaded(null);
      return;
    }

    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: directions.origin,
        destination: directions.destination,
        travelMode: directions.travelMode || google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          if (onDirectionsLoaded) onDirectionsLoaded(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
          setDirectionsResponse(null);
          if (onDirectionsLoaded) onDirectionsLoaded(null);
        }
      }
    );
  }, [isLoaded, directions, onDirectionsLoaded]);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: true,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    }),
    []
  );

  const containerClass = rounded ? 'overflow-hidden rounded-b-2xl' : '';

  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    return (
      <div className={containerClass} style={{ height }}>
        <MapPlaceholder height={height}>
          <FiMapPin className="text-brand-600" size={40} />
          <p className="max-w-sm text-sm font-medium text-slate-700 dark:text-slate-200">
            Interactive safety map
          </p>
          <p className="max-w-sm text-xs text-slate-500">
            Add <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">VITE_GOOGLE_MAPS_API_KEY</code> to
            enable live Google Maps, directions, and tracking.
          </p>
          {showHeatmap && heatmapData.length > 0 && (
            <div className="mt-2 w-full max-w-md rounded-xl border border-slate-200 bg-white/80 p-3 text-left dark:border-slate-700 dark:bg-slate-900/80">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Risk zones (preview)</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-500">
                {heatmapData.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: heatColor(p.weight) }}
                    />
                    {p.lat.toFixed(4)}, {p.lng.toFixed(4)} — risk {(p.weight * 100).toFixed(0)}%
                  </li>
                ))}
              </ul>
            </div>
          )}
          {markers.length > 0 && (
            <ul className="max-w-md text-left text-xs text-slate-500">
              {markers.map((m) => (
                <li key={m.id} className="flex items-center gap-2 py-0.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: MARKER_COLORS[m.type] || MARKER_COLORS.default }}
                  />
                  {m.label ?? `${m.lat}, ${m.lng}`}
                </li>
              ))}
            </ul>
          )}
        </MapPlaceholder>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={containerClass} style={{ height }}>
        <MapPlaceholder height={height}>
          <FiAlertCircle className="text-rose-500" size={40} />
          <p className="max-w-md text-sm font-medium text-slate-700 dark:text-slate-200">
            Google Maps failed to load
          </p>
          <p className="max-w-md text-xs text-slate-500">{loadError.message}</p>
        </MapPlaceholder>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={containerClass} style={{ height }}>
        <MapPlaceholder height={height}>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading map…</p>
        </MapPlaceholder>
      </div>
    );
  }

  return (
    <div className={`${containerClass} ${className}`} style={{ height, width: '100%' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
      >
        {/* Only show custom markers if directions aren't enabled, since DirectionsRenderer adds its own */}
        {!directionsResponse && markers.map((m) => (
          <Marker
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            title={m.label}
            icon={getMarkerIcon(m.type)}
            zIndex={m.type === 'user' ? 100 : 10}
            label={m.label ? {
              text: m.label,
              color: '#1f2937',
              fontSize: '12px',
              fontWeight: 'bold',
              className: 'map-marker-label',
            } : undefined}
          />
        ))}

        {/* Show DirectionsRenderer if we have directions */}
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: false, // Let Directions API add labeled markers
              polylineOptions: {
                strokeColor: '#3b82f6',
                strokeOpacity: 0.8,
                strokeWeight: 5,
              },
            }}
          />
        )}

        {/* If no directions, show custom polyline */}
        {!directionsResponse && polyline && polyline.path && (
          <Polyline
            path={polyline.path}
            options={{
              strokeColor: '#3b82f6',
              strokeOpacity: 0.8,
              strokeWeight: 4,
              ...polyline.options,
            }}
          />
        )}

        {/* Heatmap */}
        {showHeatmap &&
          heatmapData.map((p, i) => (
            <Circle
              key={i}
              center={{ lat: p.lat, lng: p.lng }}
              radius={400 + p.weight * 600}
              options={{
                fillColor: heatColor(p.weight),
                fillOpacity: 0.35,
                strokeColor: heatColor(p.weight),
                strokeOpacity: 0.5,
                strokeWeight: 1,
              }}
            />
          ))}
      </GoogleMap>
    </div>
  );
}
