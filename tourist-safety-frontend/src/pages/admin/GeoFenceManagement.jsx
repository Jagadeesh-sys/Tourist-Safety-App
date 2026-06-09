import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import GeoFenceCard from '../../components/cards/GeoFenceCard';
import SafetyHeatmap from '../../components/maps/SafetyHeatmap';
import { safetyService } from '../../services/safetyService';

export default function GeoFenceManagement() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    safetyService.getGeofenceZones().then(setZones);
  }, []);

  return (
    <div className="page-container space-y-6">
      <PageHeader title="GeoFence Management" subtitle="Define and monitor safety zones." actions={<Button>Add zone</Button>} />
      <div className="grid gap-4 md:grid-cols-2">{zones.map((z) => <GeoFenceCard key={z.id} alert={z} />)}</div>
      <SafetyHeatmap />
    </div>
  );
}
