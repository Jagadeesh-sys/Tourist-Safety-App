import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiFileText,
  FiFlag,
  FiLayers,
  FiMapPin,
  FiShield,
} from 'react-icons/fi';
import Button from '../../components/common/Button';
import StatCard from '../../components/dashboard/StatCard';
import SafetyScore from '../../components/dashboard/SafetyScore';
import RiskIndicator from '../../components/cards/RiskIndicator';
import GeoFenceCard from '../../components/cards/GeoFenceCard';
import SafetyMapPanel from '../../components/maps/SafetyMapPanel';
import BarChartCard from '../../components/maps/BarChartCard';
import { analyticsService } from '../../services/analyticsService';
import { safetyService } from '../../services/safetyService';

function scoreToRisk(score) {
  if (score >= 85) return 'low';
  if (score >= 70) return 'medium';
  return 'high';
}

function bumpRisk(level) {
  if (level === 'low') return 'medium';
  if (level === 'medium') return 'high';
  return 'high';
}

function DashboardSkeleton() {
  return (
    <div className="page-container animate-pulse space-y-6">
      <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <div className="h-[520px] rounded-2xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}

export default function SafetyDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    safetyScore: 0,
    activeAlerts: 0,
    incidentsThisMonth: 0,
    sosCount: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      safetyService.getSafetyStats(),
      safetyService.getGeofenceAlerts(),
      analyticsService.getChartData(),
    ]).then(([statsRes, alertsRes, chartsRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value);
      if (alertsRes.status === 'fulfilled') {
        const value = alertsRes.value;
        setAlerts(Array.isArray(value) ? value : value?.data ?? []);
      }
      if (chartsRes.status === 'fulfilled') setCharts(chartsRes.value);
      setLoading(false);
    });
  }, []);

  const areaRisk = useMemo(() => scoreToRisk(stats.safetyScore ?? 0), [stats.safetyScore]);
  const nightRisk = useMemo(() => bumpRisk(areaRisk), [areaRisk]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="page-container">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-slate-800 via-brand-800 to-brand-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-100">Safety intelligence</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">Safety Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100/90">
              Monitor regional risk, geofence alerts, and incident density on an interactive map.
              Data updates when new reports are filed on the platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/tourist/geofence">
              <Button className="bg-white text-brand-700 hover:bg-brand-50">
                <FiLayers size={16} className="mr-1" />
                GeoFence alerts
              </Button>
            </Link>
            <Link to="/tourist/sos">
              <Button variant="danger">SOS Emergency</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Safety Score"
          value={stats.safetyScore ?? 0}
          icon={FiShield}
          tone="emerald"
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts ?? 0}
          icon={FiAlertTriangle}
          tone="rose"
        />
        <StatCard
          title="Incidents (month)"
          value={stats.incidentsThisMonth ?? 0}
          icon={FiFlag}
          tone="amber"
        />
        <StatCard
          title="Active SOS"
          value={stats.sosCount ?? 0}
          icon={FiMapPin}
          tone="violet"
        />
      </div>

      {/* Map + sidebar */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SafetyMapPanel height="520px" />
        </div>

        <aside className="space-y-5">
          <SafetyScore score={stats.safetyScore ?? 0} />

          <div className="space-y-3">
            <RiskIndicator level={areaRisk} label="Current area" />
            <RiskIndicator level={nightRisk} label="Night travel" />
          </div>

          <div className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">GeoFence alerts</h3>
              <Link
                to="/tourist/geofence"
                className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                View all
              </Link>
            </div>
            {alerts.length > 0 ? (
              <div className="mt-4 space-y-3">
                {alerts.slice(0, 2).map((alert) => (
                  <GeoFenceCard key={alert.id} alert={alert} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No active geofence alerts in your area.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Regional chart + actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {charts?.safetyByRegion && (
          <div className="lg:col-span-2">
            <BarChartCard
              title="Safety score by region"
              labels={charts.safetyByRegion.labels}
              values={charts.safetyByRegion.values}
            />
          </div>
        )}

        <div className="glass-panel p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white">Quick actions</h3>
          <p className="mt-1 text-sm text-slate-500">Respond to safety events quickly</p>
          <div className="mt-4 space-y-2">
            <Link
              to="/tourist/incident"
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
            >
              <FiFileText className="text-amber-500" size={18} />
              <span className="font-medium text-slate-700 dark:text-slate-200">Report incident</span>
            </Link>
            <Link
              to="/tourist/live-tracking"
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
            >
              <FiMapPin className="text-brand-500" size={18} />
              <span className="font-medium text-slate-700 dark:text-slate-200">Share live location</span>
            </Link>
            <Link
              to="/tourist/smart-routes"
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:hover:border-brand-800 dark:hover:bg-brand-950/30"
            >
              <FiShield className="text-emerald-500" size={18} />
              <span className="font-medium text-slate-700 dark:text-slate-200">Find safer routes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
