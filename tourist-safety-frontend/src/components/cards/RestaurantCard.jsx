import { FiStar, FiMapPin, FiHeart } from 'react-icons/fi';
import { useState } from 'react';

export default function RestaurantCard({ item }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="glass-panel overflow-hidden transition hover:-translate-y-1 hover:shadow-elevated">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="h-48 w-full object-cover"
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
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <FiMapPin size={14} /> {item.cuisine} · {item.city}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <FiStar className="fill-current" size={16} />
            <span className="font-semibold">{item.rating}</span>
            <span className="text-slate-500">(Very Good)</span>
          </div>
          <span className="rounded-xl bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
            ~${item.price}
          </span>
        </div>
      </div>
    </article>
  );
}
