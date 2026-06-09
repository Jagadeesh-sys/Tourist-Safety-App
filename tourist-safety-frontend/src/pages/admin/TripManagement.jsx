import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { tripService } from '../../services/tripService';

// Helper function to get status badge styles for trips
const getTripStatusBadge = (status) => {
  const statusLower = (status || '').toLowerCase();
  const styles = {
    planned: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    completed: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[statusLower] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}>
      {status || 'Unknown'}
    </span>
  );
};

// Helper function to get safety score badge
const getSafetyScoreBadge = (score) => {
  const numScore = Number(score) || 0;
  let colorClass = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  
  if (numScore >= 85) {
    colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
  } else if (numScore >= 70) {
    colorClass = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
  } else {
    colorClass = 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
        {numScore}
      </span>
      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div 
          className={`h-full transition-all duration-300 ${
            numScore >= 85 ? 'bg-emerald-500' : numScore >= 70 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${Math.min(100, numScore)}%` }}
        />
      </div>
    </div>
  );
};

export default function TripManagement() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getAllAdmin();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    const interval = setInterval(fetchTrips, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const columns = [
    { key: 'title', label: 'Trip Title' },
    { key: 'destination', label: 'Destination' },
    { key: 'status', label: 'Status', render: (row) => getTripStatusBadge(row.status) },
    { key: 'safetyScore', label: 'Safety Score', render: (row) => getSafetyScoreBadge(row.safetyScore) },
  ];

  return (
    <div className="page-container space-y-6">
      <PageHeader title="Trip Management" subtitle="Monitor all tourist trips on the platform." />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-500"></div>
              <span>Loading…</span>
            </>
          ) : (
            <span>{trips.length} {trips.length === 1 ? 'trip' : 'trips'}</span>
          )}
        </div>
      </div>
      <DataTable columns={columns} rows={trips} emptyMessage="No trips found." />
    </div>
  );
}
