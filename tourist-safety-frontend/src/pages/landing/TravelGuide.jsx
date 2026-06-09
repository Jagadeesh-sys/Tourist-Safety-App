import { useState, useEffect } from 'react';
import LandingLayout from './LandingLayout';
import { contentService } from '../../services/contentService';
import { FiBook, FiSun, FiGlobe, FiCheckCircle } from 'react-icons/fi';

const guideIcons = {
  tips: FiBook,
  laws: FiCheckCircle,
  weather: FiSun,
  language: FiGlobe,
};

const guideColors = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-green-100 text-green-700',
};

export default function TravelGuide() {
  const [guide, setGuide] = useState([]);

  useEffect(() => {
    contentService.getLanding().then((data) => {
      setGuide(data.travelGuide || [
        { id: 1, title: 'Travel Tips', subtitle: 'Read More', color: 'blue', icon: 'tips' },
        { id: 2, title: 'Local Laws', subtitle: 'Read More', color: 'purple', icon: 'laws' },
        { id: 3, title: 'Weather Updates', subtitle: 'View List', color: 'orange', icon: 'weather' },
        { id: 4, title: 'Language Guide', subtitle: 'Read More', color: 'green', icon: 'language' },
      ]);
    });
  }, []);

  return (
    <LandingLayout title="Travel Guide">
      <div className="grid gap-6 md:grid-cols-2">
        {guide.map((item) => {
          const Icon = guideIcons[item.icon] || FiBook;
          return (
            <div
              key={item.id}
              className="flex items-start gap-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition"
            >
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${guideColors[item.color] || guideColors.blue}`}>
                <Icon size={36} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-slate-600">Explore essential {item.title.toLowerCase()} for your trip.</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-landing-primary hover:gap-3 transition-all"
                >
                  {item.subtitle}
                  <FiCheckCircle size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </LandingLayout>
  );
}
