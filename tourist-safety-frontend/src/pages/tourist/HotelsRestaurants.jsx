import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import HotelCard from '../../components/cards/HotelCard';
import RestaurantCard from '../../components/cards/RestaurantCard';
import { travelService } from '../../services/travelService';

export default function HotelsRestaurants() {
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hotels');

  useEffect(() => {
    Promise.all([
      travelService.getHotels(),
      travelService.getRestaurants(),
    ]).then(([hotelsData, restaurantsData]) => {
      setHotels(hotelsData);
      setRestaurants(restaurantsData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page-container space-y-8">
      <Link
        to="/tourist/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <FiArrowLeft size={16} />
        Back to dashboard
      </Link>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-brand-100">Stay & Dine</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Hotels & Restaurants
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-100/90">
            Curated stays and dining experiences with safety as a top priority.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'hotels'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Hotels
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'restaurants'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Restaurants
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="glass-panel overflow-hidden animate-pulse"
            >
              <div className="h-48 w-full bg-slate-200 dark:bg-slate-800" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-2/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'hotels' ? (
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Popular Hotels
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((h) => (
              <HotelCard key={h.id} item={h} />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Top Restaurants
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
