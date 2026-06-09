import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import GoogleMapView from '../../components/maps/GoogleMapView';
import DataTable from '../../components/common/DataTable';
import { safetyService } from '../../services/safetyService';
import { mapService } from '../../services/mapService';

export default function LiveSOS() {
  const [sos, setSos] = useState([]);
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    safetyService.getAdminSOS().then(setSos);
    mapService.getSOSMarkers().then(setMapData);
  }, []);

  const columns = [
    { key: 'tourist', label: 'Tourist' },
    { key: 'location', label: 'Location' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="page-container space-y-6">
      <PageHeader title="Live SOS Tracking" subtitle="Real-time map and active emergency list." />
      <div className="glass-panel overflow-hidden">
        <GoogleMapView height="420px" center={mapData?.center} markers={mapData?.markers ?? []} />
      </div>
      <DataTable columns={columns} rows={sos} />
    </div>
  );
}
