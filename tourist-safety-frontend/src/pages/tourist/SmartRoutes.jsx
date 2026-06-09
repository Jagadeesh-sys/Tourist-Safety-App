import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import GoogleMapView from '../../components/maps/GoogleMapView';
import { travelService } from '../../services/travelService';

export default function SmartRoutes() {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    travelService.getRouteRecommendation().then(setRoute);
  }, []);

  return (
    <div className="page-container">
      <PageHeader title="Smart Route Recommendation" subtitle="AI-optimized paths that avoid high-risk zones." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6">
          {route ? (
            <>
              <p className="text-sm text-slate-500">{route.distance} · {route.duration}</p>
              <p className="mt-2 font-medium text-emerald-600">{route.safetyNote}</p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
                {route.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </>
          ) : (
            <p className="text-sm text-slate-500">Loading route…</p>
          )}
        </div>
        <div className="glass-panel overflow-hidden">
          <GoogleMapView
            height="320px"
            center={route?.center}
            markers={route?.markers ?? []}
          />
        </div>
      </div>
    </div>
  );
}
