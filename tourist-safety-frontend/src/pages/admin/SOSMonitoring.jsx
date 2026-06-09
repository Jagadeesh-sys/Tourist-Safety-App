import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import GoogleMapView from '../../components/maps/GoogleMapView';
import { safetyService } from '../../services/safetyService';
import { mapService } from '../../services/mapService';

export default function SOSMonitoring() {
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
      <PageHeader title="SOS Monitoring" subtitle="Live emergency requests across the platform." />
      <DataTable columns={columns} rows={sos} />
      <div className="glass-panel overflow-hidden">
        <GoogleMapView
          height="360px"
          center={mapData?.center}
          markers={mapData?.markers ?? []}
        />
      </div>
    </div>
  );
}
