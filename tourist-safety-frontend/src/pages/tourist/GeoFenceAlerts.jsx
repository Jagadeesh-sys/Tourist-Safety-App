import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import GeoFenceCard from '../../components/cards/GeoFenceCard';
import { safetyService } from '../../services/safetyService';

export default function GeoFenceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await safetyService.getGeofenceAlerts();
        console.log("GeoFence Alerts:", data);
        setAlerts(Array.isArray(data) ? data : data?.data ?? []);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="page-container">
      <PageHeader
        title="GeoFence Alerts"
        subtitle="Zone-based warnings when you enter risk areas."
      />

      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No GeoFence alerts found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {alerts.map((alert) => (
            <GeoFenceCard
              key={alert.id}
              alert={alert}
            />
          ))}
        </div>
      )}
    </div>
  );
}