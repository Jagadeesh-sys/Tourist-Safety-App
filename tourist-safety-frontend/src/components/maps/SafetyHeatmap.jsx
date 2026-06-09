import { useEffect, useState } from 'react';
import GoogleMapView from './GoogleMapView';
import { mapService } from '../../services/mapService';

export default function SafetyHeatmap({ height = '400px' }) {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    mapService.getHeatmap().then(setMapData);
  }, []);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h3 className="font-semibold">Safety Heat Map</h3>
        <p className="text-xs text-slate-500">Live incident density from platform data (updates when reports change).</p>
      </div>
      <GoogleMapView
        height={height}
        center={mapData?.center}
        markers={mapData?.markers ?? []}
        heatmapData={mapData?.heatmapData ?? []}
      />
    </div>
  );
}
