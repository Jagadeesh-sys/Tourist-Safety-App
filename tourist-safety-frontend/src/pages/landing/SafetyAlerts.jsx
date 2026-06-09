import { useState, useEffect } from 'react';
import LandingLayout from './LandingLayout';
import { contentService } from '../../services/contentService';
import { FiAlertTriangle, FiMapPin, FiSun } from 'react-icons/fi';

const alertIcons = {
  rain: FiMapPin,
  road: FiAlertTriangle,
  heat: FiSun,
};

const alertColors = {
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  amber: 'bg-amber-100 text-amber-700',
};

export default function SafetyAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    contentService.getLanding().then((data) => {
      setAlerts(data.safetyAlerts || [
        { id: 1, title: 'Heavy Rain Warning in Kerala', time: '2h ago', icon: 'rain', color: 'blue' },
        { id: 2, title: 'Road Block in Manali', time: '5h ago', icon: 'road', color: 'orange' },
        { id: 3, title: 'Heat Wave Alert in Rajasthan', time: '1d ago', icon: 'heat', color: 'amber' },
      ]);
    });
  }, []);

  return (
    <LandingLayout title="Safety Alerts">
      <div className="grid gap-4">
        {alerts.map((alert) => {
          const Icon = alertIcons[alert.icon] || FiAlertTriangle;
          return (
            <div
              key={alert.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${alertColors[alert.color] || alertColors.blue}`}>
                <Icon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
                <p className="text-sm text-slate-500">{alert.time}</p>
              </div>
              <span className="text-sm font-medium text-slate-500">Active</span>
            </div>
          );
        })}
      </div>
    </LandingLayout>
  );
}
