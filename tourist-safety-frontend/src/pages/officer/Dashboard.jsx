import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiClipboard, FiFlag } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { officerService } from '../../services/officerService';

export default function OfficerDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    officerService.getStats().then(setStats);
  }, []);

  if (!stats) return <div className="page-container">Loading…</div>;

  return (
    <div className="page-container">
      <PageHeader title="Officer Dashboard" subtitle="Emergency response command center." actions={<Link to="/officer/live-sos"><Button variant="danger">Live SOS</Button></Link>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Assigned cases" value={stats.assignedCases} icon={FiClipboard} />
        <StatCard title="Active SOS" value={stats.activeSos} icon={FiAlertTriangle} tone="rose" />
        <StatCard title="Open incidents" value={stats.openIncidents} icon={FiFlag} tone="amber" />
      </div>
    </div>
  );
}
