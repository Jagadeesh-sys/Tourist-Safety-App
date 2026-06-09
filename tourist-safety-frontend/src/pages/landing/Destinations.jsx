import { useState, useEffect } from 'react';
import LandingLayout from './LandingLayout';
import { FiMapPin, FiSearch, FiStar } from 'react-icons/fi';
import Button from '../../components/common/Button';
import { contentService } from '../../services/contentService';

const FALLBACK_DEST_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=800&fit=crop&q=80';

// Updated Destination Card
function DestinationCard({ dest }) {
  const [imgSrc, setImgSrc] = useState(dest.image);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setImgSrc(dest.image);
  }, [dest.image]);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl shadow-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
        <img
          src={imgSrc}
          alt={dest.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_DEST_IMAGE)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-landing-navy/95 via-landing-navy/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="flex items-center gap-1.5 font-bold text-white">
          <FiMapPin size={14} className="text-sky-300" />
          {dest.name}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-sm">
          <FiStar className="fill-amber-400 text-amber-400" size={14} />
          <span className="font-semibold text-white">{dest.rating}</span>
          <span className="text-white/70">({dest.reviews})</span>
        </div>
        <div
          className={`mt-3 overflow-hidden transition-all duration-300 ${hovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <Button variant="secondary" className="w-full" size="sm">
            Explore Now
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    contentService.getLanding().then((data) => {
      const dests = data.destinations || [
        { id: 1, name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600', rating: 4.9, reviews: 1500 },
        { id: 2, name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600', rating: 4.8, reviews: 1200 },
        { id: 3, name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600', rating: 4.9, reviews: 2100 },
        { id: 4, name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600', rating: 4.8, reviews: 1700 },
        { id: 5, name: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600', rating: 4.7, reviews: 350 },
        { id: 6, name: 'Mumbai', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46940?w=600', rating: 4.6, reviews: 980 },
        { id: 7, name: 'Delhi', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600', rating: 4.5, reviews: 1800 },
        { id: 8, name: 'Agra', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600', rating: 4.9, reviews: 2500 },
        { id: 9, name: 'Varanasi', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', rating: 4.8, reviews: 1300 },
        { id: 10, name: 'Udaipur', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', rating: 4.9, reviews: 1600 },
      ];
      setDestinations(dests);
      setLoading(false);
    });
  }, []);

  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <LandingLayout title="Destinations">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-landing-navy to-slate-900 text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-landing-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 h-64 w-64 rounded-full bg-landing-sky/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">
            Explore India
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Popular Destinations
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            From serene beaches to majestic palaces, discover the beauty of incredible India.
          </p>
          {/* Search bar */}
          <div className="mt-8 w-full max-w-xl">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for a destination..."
                className="w-full rounded-2xl border-0 bg-white/10 py-3.5 pl-12 pr-4 text-lg text-white placeholder-slate-300 shadow-lg outline-none backdrop-blur-sm transition focus:bg-white/15"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredDestinations.length}</span> destinations
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {filteredDestinations.map((dest) => (
              <DestinationCard key={dest.id ?? dest.name} dest={dest} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FiSearch size={40} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              No destinations found
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </LandingLayout>
  );
}
