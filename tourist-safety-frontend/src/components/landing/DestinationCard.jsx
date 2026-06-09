import { useState, useEffect } from 'react';
import { FiMapPin, FiStar } from 'react-icons/fi';

const FALLBACK_DEST_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=800&fit=crop&q=80';

function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <FiStar className="fill-amber-400 text-amber-400" size={14} />
      <span className="font-semibold text-white">{rating}</span>
      <span className="text-white/70">({reviews})</span>
    </div>
  );
}

export default function DestinationCard({ dest }) {
  const [imgSrc, setImgSrc] = useState(dest.image);

  useEffect(() => {
    setImgSrc(dest.image);
  }, [dest.image]);

  return (
    <article className="group relative overflow-hidden rounded-2xl shadow-card">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
        <img
          src={imgSrc}
          alt={dest.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(FALLBACK_DEST_IMAGE)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-landing-navy/90 via-landing-navy/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="flex items-center gap-1.5 font-bold text-white">
          <FiMapPin size={14} className="text-sky-300" />
          {dest.name}
        </p>
        <StarRating rating={dest.rating} reviews={dest.reviews} />
      </div>
    </article>
  );
}
