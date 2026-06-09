import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCompass, FiShield, FiUsers } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import LineChartCard from '../../components/maps/LineChartCard';
import DoughnutChartCard from '../../components/maps/DoughnutChartCard';
import { analyticsService } from '../../services/analyticsService';

export default function AdminDashboard() {
  const [m, setM] = useState(null);
  const [charts, setCharts] = useState(null);

  const fetchData = async () => {
    try {
      const [metrics, chartData] = await Promise.all([
        analyticsService.getDashboardMetrics(),
        analyticsService.getChartData()
      ]);
      setM(metrics);
      setCharts(chartData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (!m || !charts) return <div className="page-container">Loading…</div>;

  const tripsTrend = charts?.tripsTrend ?? { labels: [], values: [] };
  const incidentTypes = charts?.incidentTypes ?? { labels: [], values: [] };

  return (
    <div className="page-container">
      <PageHeader title="Admin Dashboard" subtitle="Platform-wide travel and safety intelligence." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Trips" value={m?.totalTrips ?? 0} icon={FiCompass} />
        <StatCard title="Active Tourists" value={m?.activeTourists ?? 0} icon={FiUsers} tone="violet" />
        <StatCard title="SOS Requests" value={m?.sosRequests ?? 0} icon={FiAlertTriangle} tone="rose" />
        <StatCard title="Safety Score" value={m?.safetyScore ?? 0} icon={FiShield} tone="emerald" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <LineChartCard title="Trips trend" labels={tripsTrend.labels} values={tripsTrend.values} />
        <DoughnutChartCard title="Incident types" labels={incidentTypes.labels} values={incidentTypes.values} />
      </div>
    </div>
  );
}
