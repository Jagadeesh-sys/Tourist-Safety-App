import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiLayers,
  FiMapPin,
  FiNavigation,
  FiPlus,
  FiRadio,
  FiShield,
  FiUser,
  FiX,
} from 'react-icons/fi';
import Button from '../../components/common/Button';
import { tripService } from '../../services/tripService';
import { formatDate } from '../../utils/formatters';

const POST_CREATE_TIPS = [
  {
    icon: FiShield,
    title: 'Check safety dashboard',
    description: 'Review risk levels and regional alerts for your destination.',
    link: '/tourist/safety',
    color: 'text-emerald-500',
  },
  {
    icon: FiLayers,
    title: 'Enable GeoFence alerts',
    description: 'Get warned when you enter high-risk zones during your trip.',
    link: '/tourist/geofence',
    color: 'text-amber-500',
  },
  {
    icon: FiRadio,
    title: 'Set up live tracking',
    description: 'Share your real-time location with trusted contacts.',
    link: '/tourist/live-tracking',
    color: 'text-brand-500',
  },
  {
    icon: FiNavigation,
    title: 'Plan smart routes',
    description: 'Find safer paths between attractions and your hotel.',
    link: '/tourist/smart-routes',
    color: 'text-violet-500',
  },
  {
    icon: FiUser,
    title: 'Update emergency contact',
    description: 'Make sure responders can reach someone if you need help.',
    link: '/tourist/profile',
    color: 'text-rose-500',
  },
];

const STATUS_STYLES = {
  planned: 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300',
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

function tripDuration(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
  return days > 0 ? days : null;
}

function TripsSkeleton() {
  return (
    <div className="page-container animate-pulse space-y-6">
      <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

export default function MyTrips() {
  const location = useLocation();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [createdTrip, setCreatedTrip] = useState(null);

  const loadTrips = (showLoader = true) => {
    if (showLoader) setLoading(true);
    return tripService
      .getMyTrips()
      .then((data) => setTrips(Array.isArray(data) ? data : []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (!location.state?.tripCreated) return;

    setShowTips(true);
    setCreatedTrip({
      title: location.state.tripTitle,
      destination: location.state.destination,
    });

    if (location.state.trip) {
      setTrips((prev) => {
        const exists = prev.some((t) => String(t.id) === String(location.state.trip.id));
        return exists ? prev : [location.state.trip, ...prev];
      });
    }

    loadTrips(false);
    window.history.replaceState({}, document.title, location.pathname);
  }, [location.state?.tripCreated, location.state?.trip, location.pathname]);

  const sortedTrips = useMemo(
    () =>
      [...trips].sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0)),
    [trips],
  );

  if (loading) return <TripsSkeleton />;

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-100">Your journeys</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">My Trips</h1>
            <p className="mt-2 text-sm text-brand-100/90">
              {trips.length > 0
                ? `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned — manage itineraries and safety in one place.`
                : 'Plan your adventures with safety-aware routing and live alerts.'}
            </p>
          </div>
          <Link to="/tourist/create-trip">
            <Button className="gap-2 bg-white text-brand-700 hover:bg-brand-50">
              <FiPlus size={16} />
              Create trip
            </Button>
          </Link>
        </div>
      </section>

      {/* Success + tips after create */}
      {showTips && (
        <div className="glass-panel overflow-hidden border-emerald-200 dark:border-emerald-900/50">
          <div className="flex items-start justify-between gap-4 border-b border-emerald-100 bg-emerald-50 px-5 py-4 dark:border-emerald-900/30 dark:bg-emerald-950/30">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/50">
                <FiCheckCircle size={22} />
              </div>
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                  Trip created successfully!
                </p>
                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                  <strong>{createdTrip?.title}</strong>
                  {createdTrip?.destination && ` to ${createdTrip.destination}`} is ready.
                  Follow these tips before you travel.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTips(false)}
              className="shrink-0 rounded-lg p-1.5 text-emerald-600 transition hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
              aria-label="Dismiss tips"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {POST_CREATE_TIPS.map((tip) => (
              <Link
                key={tip.title}
                to={tip.link}
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/20"
              >
                <tip.icon className={`mt-0.5 shrink-0 ${tip.color}`} size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{tip.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{tip.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trip list */}
      {sortedTrips.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedTrips.map((trip) => {
            const days = tripDuration(trip.startDate, trip.endDate);
            const statusClass = STATUS_STYLES[trip.status] ?? STATUS_STYLES.planned;

            return (
              <Link
                key={trip.id}
                to={`/tourist/trips/${trip.id}`}
                className="group glass-panel block overflow-hidden transition hover:border-brand-200 hover:shadow-elevated dark:hover:border-brand-800"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-100 dark:bg-brand-950/50 dark:text-brand-400">
                    <FiCompass size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{trip.title}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass}`}>
                        {trip.status || 'planned'}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <FiMapPin size={14} />
                      {trip.destination}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FiCalendar size={14} />
                        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                      </span>
                      {days && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium dark:bg-slate-800">
                          {days} day{days !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <FiShield size={14} />
                      Safety score: {trip.safetyScore ?? '—'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <FiCompass size={26} />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">No trips yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Create your first trip to get a safety score, smart route suggestions, and GeoFence
            alerts for your destination.
          </p>
          <Link to="/tourist/create-trip" className="mt-6 inline-block">
            <Button className="gap-2">
              <FiPlus size={16} />
              Create your first trip
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
