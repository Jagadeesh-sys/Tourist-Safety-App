import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import BarChartCard from '../../components/maps/BarChartCard';
import LineChartCard from '../../components/maps/LineChartCard';
import { analyticsService } from '../../services/analyticsService';

export default function Analytics() {
  const [charts, setCharts] = useState(null);
  useEffect(() => { analyticsService.getChartData().then(setCharts); }, []);
  if (!charts) return <div className="page-container">Loading…</div>;
  return (
    <div className="page-container space-y-6">
      <PageHeader title="Analytics Dashboard" subtitle="Insights for operations and safety planning." />
      <div className="grid gap-6 lg:grid-cols-2">
        <LineChartCard title="Trips over time" labels={charts.tripsTrend.labels} values={charts.tripsTrend.values} />
        <BarChartCard title="Safety by region" labels={charts.safetyByRegion.labels} values={charts.safetyByRegion.values} />
      </div>
    </div>
  );
}
