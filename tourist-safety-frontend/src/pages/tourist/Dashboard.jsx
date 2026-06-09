import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiCompass,
  FiMap,
  FiMapPin,
  FiMessageCircle,
  FiNavigation,
  FiRadio,
  FiShield,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import StatCard from '../../components/dashboard/StatCard';
import SafetyScore from '../../components/dashboard/SafetyScore';
import QuickActionCard from '../../components/dashboard/QuickActionCard';
import LineChartCard from '../../components/maps/LineChartCard';
import { useAuth } from '../../hooks/useAuth';
import { analyticsService } from '../../services/analyticsService';
import { safetyService } from '../../services/safetyService';
import { tripService } from '../../services/tripService';
import { formatDate } from '../../utils/formatters';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getSafetyMessage(score) {
  if (score >= 85) return 'Your area is considered safe. Enjoy your travels.';
  if (score >= 70) return 'Exercise normal caution while exploring.';
  return 'Elevated risk detected. Review safety alerts before heading out.';
}

function DashboardSkeleton() {
  return (
    <div className="page-container animate-pulse">
      <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 lg:col-span-2" />
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export default function TouristDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTrips: 0,
    popularDestinations: [],
  });
  const [safety, setSafety] = useState({
    safetyScore: 0,
    activeAlerts: 0,
  });
  const [trips, setTrips] = useState([]);
  const [charts, setCharts] = useState({
    tripsTrend: { labels: [], values: [] },
  });

  const tripCount = trips.length;
  const recentTrips = useMemo(() => trips.slice(0, 3), [trips]);
  const displayName = user?.name?.split(' ')[0] || 'Traveler';

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      analyticsService.getDashboardMetrics(),
      analyticsService.getChartData(),
      safetyService.getSafetyStats(),
      tripService.getMyTrips(),
    ]).then(([metricsRes, chartsRes, safetyRes, tripsRes]) => {
      if (cancelled) return;

      if (metricsRes.status === 'fulfilled') {
        setMetrics(metricsRes.value);
      }
      if (chartsRes.status === 'fulfilled') {
        setCharts(chartsRes.value);
      }
      if (safetyRes.status === 'fulfilled') {
        setSafety(safetyRes.value);
      }
      if (tripsRes.status === 'fulfilled') {
        const data = tripsRes.value;
        setTrips(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <DashboardSkeleton />;

  const safetyScore = safety?.safetyScore ?? 0;
  const activeAlerts = safety?.activeAlerts ?? 0;

  return (
    <div className="page-container">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-100">{getGreeting()}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              Welcome back, {displayName}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-brand-100/90">
              {getSafetyMessage(safetyScore)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/tourist/create-trip">
              <Button className="bg-white text-brand-700 hover:bg-brand-50">Plan a trip</Button>
            </Link>
            <Link to="/tourist/sos">
              <Button variant="danger" className="gap-2 shadow-lg shadow-rose-900/30">
                <FiAlertTriangle size={16} />
                SOS Emergency
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Active alerts banner */}
      {activeAlerts > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
          <div className="rounded-xl bg-rose-100 p-2 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
            <FiAlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-rose-800 dark:text-rose-200">
              {activeAlerts} active safety alert{activeAlerts !== 1 ? 's' : ''}
            </p>
            <p className="mt-0.5 text-sm text-rose-600 dark:text-rose-300">
              Review geofence and regional alerts before your next outing.
            </p>
          </div>
          <Link to="/tourist/geofence">
            <Button variant="danger" className="shrink-0 text-xs">
              View alerts
            </Button>
          </Link>
        </div>
      )}

      {/* Key metrics */}
      <section>
        <PageHeader
          title="Overview"
          subtitle="Your travel activity and safety at a glance."
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="My Trips" value={tripCount} icon={FiCompass} />
          <StatCard
            title="Safety Score"
            value={safetyScore}
            icon={FiShield}
            tone="emerald"
          />
          <StatCard
            title="Active Alerts"
            value={activeAlerts}
            icon={FiAlertTriangle}
            tone="rose"
          />
          <StatCard
            title="Platform Trips"
            value={metrics?.totalTrips ?? 0}
            icon={FiMapPin}
            tone="violet"
          />
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quick actions</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Jump to the tools you use most while traveling.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickActionCard
            to="/tourist/create-trip"
            icon={FiMap}
            title="Create trip"
            description="Plan your next adventure"
            accent="brand"
          />
          <QuickActionCard
            to="/tourist/live-tracking"
            icon={FiRadio}
            title="Live tracking"
            description="Share your real-time location"
            accent="emerald"
          />
          <QuickActionCard
            to="/tourist/smart-routes"
            icon={FiNavigation}
            title="Smart routes"
            description="Find safer travel paths"
            accent="violet"
          />
          <QuickActionCard
            to="/tourist/ai-assistant"
            icon={FiMessageCircle}
            title="AI assistant"
            description="Get personalized travel tips"
            accent="brand"
          />
        </div>
      </section>

      {/* Charts & safety score */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LineChartCard
            title="Travel activity"
            labels={charts?.tripsTrend?.labels || []}
            values={charts?.tripsTrend?.values || []}
          />
        </div>
        <SafetyScore score={safetyScore} />
      </div>

      {/* Recent trips & destinations */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="glass-panel lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Recent trips</h3>
              <p className="text-sm text-slate-500">Your latest travel plans</p>
            </div>
            <Link
              to="/tourist/my-trips"
              className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              View all
            </Link>
          </div>

          {recentTrips.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTrips.map((trip) => (
                <li key={trip.id}>
                  <Link
                    to={`/tourist/trips/${trip.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
                      <FiCompass size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900 dark:text-white">
                        {trip.title}
                      </p>
                      <p className="truncate text-sm text-slate-500">{trip.destination}</p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {trip.status}
                      </span>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(trip.startDate)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <FiCompass size={22} />
              </div>
              <p className="mt-3 font-medium text-slate-700 dark:text-slate-300">No trips yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Start planning your first journey to see it here.
              </p>
              <Link to="/tourist/create-trip" className="mt-4 inline-block">
                <Button>Create your first trip</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="glass-panel p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Popular destinations</h3>
            <p className="mt-1 text-sm text-slate-500">Trending among travelers on the platform</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(metrics?.popularDestinations || []).length > 0 ? (
                metrics.popularDestinations.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-900 dark:bg-brand-950/50 dark:text-brand-300"
                  >
                    <FiMapPin size={12} />
                    {d}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No destination data available yet.</p>
              )}
            </div>
          </div>

          <div className="glass-panel p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Safety resources</h3>
            <p className="mt-1 text-sm text-slate-500">Stay informed and prepared</p>
            <div className="mt-4 space-y-2">
              <Link
                to="/tourist/safety"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
              >
                <FiShield className="text-emerald-500" size={18} />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  Safety dashboard
                </span>
              </Link>
              <Link
                to="/tourist/incident"
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
              >
                <FiAlertTriangle className="text-amber-500" size={18} />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  Report an incident
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
