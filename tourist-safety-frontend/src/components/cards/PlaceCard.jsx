import { FiMapPin, FiStar } from 'react-icons/fi';

export default function PlaceCard({ item }) {
  return (
    <article className="glass-panel overflow-hidden transition hover:-translate-y-0.5 hover:shadow-elevated">
      <img src={item.image} alt={item.name} className="h-40 w-full object-cover" loading="lazy" />
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <FiMapPin size={14} /> {item.city}
        </p>
        <p className="mt-2 flex items-center gap-1 text-sm font-medium text-amber-600">
          <FiStar className="fill-current" size={14} /> {item.rating}
        </p>
      </div>
    </article>
  );
}
