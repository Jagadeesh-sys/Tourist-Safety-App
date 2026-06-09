import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiCompass,
  FiMapPin,
  FiNavigation,
  FiShield,
} from 'react-icons/fi';
import GoogleMapView from '../../components/maps/GoogleMapView';
import { tripService } from '../../services/tripService';
import { formatDate } from '../../utils/formatters';

// Destination coordinates for popular cities
const DESTINATION_COORDS = {
  'Goa': { lat: 15.2993, lng: 74.124 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Delhi': { lat: 28.6139, lng: 77.209 },
  'Mumbai': { lat: 19.076, lng: 72.8777 },
  'Agra': { lat: 27.1767, lng: 78.0081 },
  'Varanasi': { lat: 25.3176, lng: 82.9739 },
  'Kerala': { lat: 10.8505, lng: 76.2711 },
  'Manali': { lat: 32.2432, lng: 77.1892 },
  'Hyderabad': { lat: 17.385, lng: 78.4867 },
  'Udaipur': { lat: 24.5854, lng: 73.7125 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
};

// Haversine formula for fallback distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 15.2993, lng: 74.124 });
  const [locationError, setLocationError] = useState(null);
  const [directionsResult, setDirectionsResult] = useState(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState(false);

  // Check if Google Maps API key is present
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    setApiKeyAvailable(!!apiKey && apiKey !== 'your_google_maps_api_key_here');
  }, []);

  // Get destination coordinates
  const destinationCoords = useMemo(() => {
    if (!trip?.destination) return null;
    for (const [city, coords] of Object.entries(DESTINATION_COORDS)) {
      if (trip.destination.toLowerCase().includes(city.toLowerCase())) {
        return coords;
      }
    }
    return null;
  }, [trip]);

  // Directions prop for GoogleMapView
  const directions = useMemo(() => {
    if (!destinationCoords || !apiKeyAvailable) return null;
    return {
      origin: userLocation,
      destination: destinationCoords,
      travelMode: 'DRIVING',
    };
  }, [userLocation, destinationCoords, apiKeyAvailable]);

  // Calculate distance and time (from Directions API if available, otherwise fallback)
  const distance = useMemo(() => {
    if (directionsResult?.routes?.[0]?.legs?.[0]?.distance) {
      return directionsResult.routes[0].legs[0].distance.text;
    }
    if (!destinationCoords) return null;
    const dist = calculateDistance(userLocation.lat, userLocation.lng, destinationCoords.lat, destinationCoords.lng);
    return `${dist.toFixed(1)} km`;
  }, [directionsResult, userLocation, destinationCoords]);

  const estimatedTime = useMemo(() => {
    if (directionsResult?.routes?.[0]?.legs?.[0]?.duration) {
      return directionsResult.routes[0].legs[0].duration.text;
    }
    if (!destinationCoords) return null;
    const dist = calculateDistance(userLocation.lat, userLocation.lng, destinationCoords.lat, destinationCoords.lng);
    const minutes = Math.round((dist / 60) * 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }, [directionsResult, userLocation, destinationCoords]);

  // Load trip
  useEffect(() => {
    tripService.getById(id).then(setTrip);
  }, [id]);

  // Watch user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationError(null);
      },
      (err) => {
        setLocationError(err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Prepare map markers (for when directions aren't available)
  const markers = useMemo(() => {
    const m = [
      {
        id: 'user',
        lat: userLocation.lat,
        lng: userLocation.lng,
        label: 'Your Location',
        type: 'user',
      },
    ];
    if (destinationCoords) {
      m.push({
        id: 'destination',
        lat: destinationCoords.lat,
        lng: destinationCoords.lng,
        label: trip?.destination || 'Destination',
        type: 'safe',
      });
    }
    return m;
  }, [userLocation, destinationCoords, trip]);

  const mapCenter = useMemo(() => {
    if (destinationCoords) {
      return {
        lat: (userLocation.lat + destinationCoords.lat) / 2,
        lng: (userLocation.lng + destinationCoords.lng) / 2,
      };
    }
    return userLocation;
  }, [userLocation, destinationCoords]);

  if (!trip) return <div className="page-container">Loading…</div>;

  return (
    <div className="page-container space-y-6">
      <Link
        to="/tourist/trips"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <FiArrowLeft size={16} />
        Back to My Trips
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-brand-100">Trip Details</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{trip.title}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-brand-100/90">
            <FiMapPin size={16} />
            {trip.destination}
          </p>
        </div>
      </section>

      {/* Live Trip Tracking */}
      <section className="glass-panel overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <FiNavigation size={18} />
            Live Trip Tracking
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {apiKeyAvailable
              ? "Real-time turn-by-turn directions to your destination"
              : "Add VITE_GOOGLE_MAPS_API_KEY for real-time Google Directions"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-3 dark:border-slate-800">
          <div className="rounded-xl bg-brand-50 p-4 text-center dark:bg-brand-950/50">
            <FiMapPin className="mx-auto mb-2 text-brand-600" size={24} />
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Your Location</p>
            <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          </div>
          {distance && (
            <div className="rounded-xl bg-emerald-50 p-4 text-center dark:bg-emerald-950/50">
              <FiCompass className="mx-auto mb-2 text-emerald-600" size={24} />
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Distance</p>
              <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {distance}
              </p>
            </div>
          )}
          {estimatedTime && (
            <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-950/50">
              <FiClock className="mx-auto mb-2 text-amber-600" size={24} />
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Estimated Time</p>
              <p className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-400">
                {estimatedTime}
              </p>
            </div>
          )}
        </div>

        {/* Map */}
        <GoogleMapView
          center={mapCenter}
          markers={markers}
          zoom={destinationCoords ? 10 : 12}
          height="480px"
          rounded
          directions={directions}
          onDirectionsLoaded={setDirectionsResult}
        />
      </section>

      {/* Trip Info Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <FiCalendar size={18} />
            Trip Itinerary
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <FiCalendar className="mt-0.5 shrink-0 text-brand-600" size={16} />
              <span>
                <strong>Dates:</strong> {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FiShield className="mt-0.5 shrink-0 text-emerald-600" size={16} />
              <span>
                <strong>Safety Score:</strong> {trip.safetyScore}/100
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FiMapPin className="mt-0.5 shrink-0 text-violet-600" size={16} />
              <span>
                <strong>Status:</strong>
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize dark:bg-slate-800">
                  {trip.status}
                </span>
              </span>
            </li>
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white">Notes</h3>
          <p className="mt-2 text-slate-500">{trip.notes || 'No additional notes for this trip.'}</p>
        </div>
      </div>
    </div>
  );
}
