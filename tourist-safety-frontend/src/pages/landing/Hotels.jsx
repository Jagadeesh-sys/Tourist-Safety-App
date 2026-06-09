import { useState, useEffect } from 'react';
import LandingLayout from './LandingLayout';
import { contentService } from '../../services/contentService';
import { FiHome, FiCoffee, FiShield, FiHeart } from 'react-icons/fi';

const safeIcons = {
  hotel: FiHome,
  restaurant: FiCoffee,
  police: FiShield,
  hospital: FiHeart,
};

export default function Hotels() {
  const [safePlaces, setSafePlaces] = useState([]);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    contentService.getLanding().then((data) => {
      setSafePlaces(data.safePlaces || [
        { id: 1, label: 'Safe Hotels', icon: 'hotel', count: 24 },
        { id: 2, label: 'Safe Restaurants', icon: 'restaurant', count: 56 },
        { id: 3, label: 'Police Stations', icon: 'police', count: 12 },
        { id: 4, label: 'Hospitals', icon: 'hospital', count: 8 },
      ]);
      setHotels([
        { id: 1, name: 'Ocean Breeze Resort', type: 'Hotel', price: 120, rating: 4.5, city: 'Goa', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600' },
        { id: 2, name: 'Heritage Haveli', type: 'Hotel', price: 95, rating: 4.7, city: 'Jaipur', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600' },
        { id: 3, name: 'Munnar Tea Valley Resort', type: 'Hotel', price: 110, rating: 4.8, city: 'Kerala', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
      ]);
    });
  }, []);

  return (
    <LandingLayout title="Hotels & Safe Places">
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Safe Places Nearby</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {safePlaces.map((place) => {
            const Icon = safeIcons[place.icon] || FiHome;
            return (
              <div key={place.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:border-landing-primary/30 hover:bg-landing-primary/5 transition">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-landing-primary/10 text-landing-primary">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{place.label}</p>
                  {place.count && <p className="text-sm text-slate-500">{place.count} verified</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">Top Rated Hotels</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition">
            <img src={hotel.image} alt={hotel.name} className="h-48 w-full object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-landing-primary">{hotel.type}</span>
                <span className="text-sm font-semibold text-slate-600">${hotel.price}/night</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{hotel.name}</h3>
              <p className="text-sm text-slate-500">{hotel.city}</p>
              <div className="mt-4 flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(hotel.rating) ? 'fill-amber-500' : 'text-slate-300'}>★</span>
                ))}
                <span className="ml-2 text-sm font-medium text-slate-600">{hotel.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </LandingLayout>
  );
}
