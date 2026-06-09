import { useState, useEffect } from 'react';
import LandingLayout from './LandingLayout';
import { contentService } from '../../services/contentService';
import { FiPhone } from 'react-icons/fi';

const emergencyStyles = {
  blue: 'border-blue-200 bg-blue-50',
  red: 'border-red-200 bg-red-50',
  orange: 'border-orange-200 bg-orange-50',
  green: 'border-green-200 bg-green-50',
};

export default function Emergency() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    contentService.getLanding().then((data) => {
      setServices(data.emergencyServices || [
        { id: 1, name: 'Police', number: '100', color: 'blue', action: 'Call Now' },
        { id: 2, name: 'Ambulance', number: '108', color: 'red', action: 'Call Now' },
        { id: 3, name: 'Fire Service', number: '101', color: 'orange', action: 'Call Now' },
        { id: 4, name: 'Hospitals', number: '—', color: 'green', action: 'View List' },
      ]);
    });
  }, []);

  return (
    <LandingLayout title="Emergency Services">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`flex flex-col items-center rounded-2xl border p-8 text-center ${emergencyStyles[service.color] || emergencyStyles.blue}`}
          >
            <FiPhone size={32} className="mb-4" />
            <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
            <p className="my-2 text-4xl font-bold tracking-tight text-slate-900">{service.number}</p>
            <button
              type="button"
              className="mt-4 rounded-xl bg-white px-6 py-3 text-sm font-bold shadow-sm hover:shadow-md transition"
              onClick={() => service.number !== '—' && window.open(`tel:${service.number}`)}
            >
              {service.action}
            </button>
          </div>
        ))}
      </div>
    </LandingLayout>
  );
}
