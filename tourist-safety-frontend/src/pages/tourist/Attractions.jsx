import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiFilter,
  FiHeart,
  FiInfo,
  FiMapPin,
  FiSearch,
  FiStar,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import PlaceCard from '../../components/cards/PlaceCard';
import Button from '../../components/common/Button';
import { travelService } from '../../services/travelService';

// Helper to get category color
const getCategoryColor = (category) => {
  const cats = {
    temple: 'text-orange-600 bg-orange-100',
    monument: 'text-purple-600 bg-purple-100',
    beach: 'text-cyan-600 bg-cyan-100',
    hill: 'text-emerald-600 bg-emerald-100',
    cultural: 'text-rose-600 bg-rose-100',
  };
  return cats[category?.toLowerCase()] || 'text-slate-600 bg-slate-100';
};

// Enhanced Place Card
const AttractionCard = ({ attraction }) => {
  const [liked, setLiked] = useState(false);
  return (
    <article className="glass-panel overflow-hidden transition hover:-translate-y-1 hover:shadow-elevated">
      <div className="relative">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="h-52 w-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow transition hover:bg-white dark:bg-slate-800/90 dark:text-white dark:hover:bg-slate-800"
        >
          <FiHeart
            size={18}
            className={`transition ${liked ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>
        <div className="absolute bottom-3 left-3 flex gap-2">
          {attraction.category && (
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(attraction.category)}`}>
              {attraction.category}
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">{attraction.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <FiMapPin size={14} /> {attraction.city}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="flex items-center gap-1 text-sm font-medium text-amber-600">
            <FiStar className="fill-current" size={14} /> {attraction.rating}
            <span className="text-slate-500 font-normal">
              ({attraction.reviews || 0} reviews)
            </span>
          </p>
          <Button variant="secondary" size="sm">
            <FiInfo size={14} />
            Details
          </Button>
        </div>
      </div>
    </article>
  );
};

export default function Attractions() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    travelService.getAttractions().then((data) => {
      // Add some sample categories if not present
      const enhancedData = data.map((item, idx) => ({
        ...item,
        category: ['monument', 'temple', 'beach', 'cultural', 'hill'][idx % 5],
        reviews: item.reviews || Math.floor(Math.random() * 1000) + 50,
      }));
      setItems(enhancedData);
      setLoading(false);
    });
  }, []);

  // Filter and sort items
  const filtered = items
    .filter((i) =>
      (i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.city.toLowerCase().includes(q.toLowerCase())) &&
      (filterCategory === 'all' || i.category === filterCategory)
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return (b.reviews || 0) - (a.reviews || 0);
      return 0;
    });

  const categories = ['all', 'monument', 'temple', 'beach', 'cultural', 'hill'];

  return (
    <div className="page-container">
      <Link
        to="/tourist/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
      >
        <FiArrowLeft size={16} />
        Back to dashboard
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-brand-700/20 bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 p-6 text-white shadow-elevated md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-brand-100">Explore</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Tourist Attractions
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-100/90">
            Discover top-rated places near your route, from ancient temples to stunning beaches.
          </p>
        </div>
      </section>

      {/* Filters and search */}
      <div className="glass-panel p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <SearchBar
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search attractions by name or city…"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:border-brand-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              <option value="rating">Highest rated</option>
              <option value="reviews">Most reviews</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> attractions
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <article
                key={idx}
                className="glass-panel overflow-hidden animate-pulse"
              >
                <div className="h-52 w-full bg-slate-200 dark:bg-slate-800" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-2/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              </article>
            ))
          ) : filtered.length > 0 ? (
            filtered.map((item) => <AttractionCard key={item.id} attraction={item} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <FiSearch size={32} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                No attractions found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
