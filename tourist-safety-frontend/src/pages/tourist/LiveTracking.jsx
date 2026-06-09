import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiMapPin,
  FiNavigation,
  FiShare2,
  FiShield,
  FiUsers,
} from 'react-icons/fi';
import Button from '../../components/common/Button';
import LiveTrackingMap from '../../components/maps/LiveTrackingMap';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime } from '../../utils/formatters';

const SHARING_STATUSES = [
  { id: 'off', label: 'Sharing off', color: 'text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800' },
  { id: 'contacts', label: 'Trusted contacts', color: 'text-brand-700 bg-brand-100 dark:text-brand-300 dark:bg-brand-950/50' },
  { id: 'all', label: 'Everyone (emergency)', color: 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-950/50' },
];

const defaultPosition = { lat: 15.2993, lng: 74.124 };

function StatusBadge({ status }) {
  const statusInfo = SHARING_STATUSES.find((s) => s.id === status) || SHARING_STATUSES[0];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
}

export default function LiveTracking() {
  const { user } = useAuth();
  const [sharingStatus, setSharingStatus] = useState('off');
  const [position, setPosition] = useState(defaultPosition);
  const [locationStatus, setLocationStatus] = useState('loading'); // loading | granted | denied
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('granted');
        setLastUpdated(new Date());
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const toggleSharing = (newStatus) => {
    setSharingStatus(newStatus);
  };

  return (
    <div className="page-container">
      <Link
        to="/tourist/safety-dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <FiArrowLeft size={16} />
        Back to safety dashboard
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-brand-100">Location sharing</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Live tracking</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-100/90">
            Share your real-time location with trusted contacts or safety officers for peace of mind while traveling.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Map panel */}
        <div className="space-y-5 xl:col-span-3">
          <div className="glass-panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Your live location</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {locationStatus === 'loading' && 'Acquiring GPS signal…'}
                  {locationStatus === 'granted' && 'GPS active — location updating in real time'}
                  {locationStatus === 'denied' && 'Location unavailable — enable GPS to use live tracking'}
                </p>
              </div>
              {lastUpdated && (
                <p className="text-xs text-slate-500">Updated {formatDateTime(lastUpdated)}</p>
              )}
            </div>
            <LiveTrackingMap />
          </div>

          {/* Location details */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-panel p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Latitude</p>
              <p className="mt-1 font-mono text-lg text-slate-900 dark:text-white">
                {position.lat.toFixed(4)}°
              </p>
            </div>
            <div className="glass-panel p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">Longitude</p>
              <p className="mt-1 font-mono text-lg text-slate-900 dark:text-white">
                {position.lng.toFixed(4)}°
              </p>
            </div>
            <div className="glass-panel p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">GPS status</p>
              <p className="mt-1 flex items-center gap-2 text-sm">
                {locationStatus === 'granted' ? (
                  <FiCheckCircle className="text-emerald-500" size={16} />
                ) : (
                  <FiNavigation className="text-amber-500" size={16} />
                )}
                <span className="text-slate-900 dark:text-white capitalize">
                  {locationStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div className="space-y-5 xl:col-span-2">
          <div className="glass-panel overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">Sharing settings</h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose who can see your real-time location.
              </p>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Current status
                </span>
                <StatusBadge status={sharingStatus} />
              </div>
              <div className="space-y-2">
                {SHARING_STATUSES.map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => toggleSharing(status.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      sharingStatus === status.id
                        ? 'border-brand-500 bg-brand-50 dark:border-brand-600 dark:bg-brand-950/30'
                        : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${status.color}`}>
                        {status.id === 'off' && <FiShield size={16} />}
                        {status.id === 'contacts' && <FiUsers size={16} />}
                        {status.id === 'all' && <FiMapPin size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {status.label}
                        </p>
                        <p className="text-xs text-slate-500">
                          {status.id === 'off' && 'No one can see your location'}
                          {status.id === 'contacts' && 'Only trusted contacts'}
                          {status.id === 'all' && 'Contacts + nearby safety officers'}
                        </p>
                      </div>
                    </div>
                    {sharingStatus === status.id && (
                      <FiCheckCircle className="text-brand-600" size={18} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel p-5">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <FiShare2 size={18} />
              Share your location
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Send a link to your live location via message or email.
            </p>
            <div className="mt-4 space-y-3">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  const shareUrl = `${window.location.origin}/share-location?lat=${position.lat.toFixed(4)}&lng=${position.lng.toFixed(4)}`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'My live location',
                      text: 'Check out my real-time location!',
                      url: shareUrl,
                    });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Location link copied to clipboard!');
                  }
                }}
              >
                <FiShare2 size={16} />
                Share location link
              </Button>
              <Link to="/tourist/sos">
                <Button variant="danger" className="w-full">
                  <FiShield size={16} />
                  Emergency SOS
                </Button>
              </Link>
            </div>
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Safety tips</h3>
            <ul className="mt-4 space-y-2.5">
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" size={14} />
                Keep location sharing on only when needed
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" size={14} />
                Share your location only with trusted people
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" size={14} />
                Enable high accuracy mode for best results
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
