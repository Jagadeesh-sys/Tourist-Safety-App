import logoImage from '../../assets/Tourist Safety logo.png';

const SIZES = {
  sm: { icon: 48, title: 'text-lg', tagline: 'text-[11px]' },
  md: { icon: 64, title: 'text-2xl', tagline: 'text-xs' },
  lg: { icon: 80, title: 'text-3xl', tagline: 'text-sm' },
};

function LogoMark({ size = 64, className = '' }) {
  return (
    <img
      src={logoImage}
      alt="Tourist Safety Logo"
      width={size}
      height={size}
      className={className}
    />
  );
}

/**
 * TouristSafety brand logo — updated travel/safety mark with wordmark.
 */
export default function Logo({
  size = 'md',
  showText = true,
  variant = 'default',
  className = '',
  tagline = 'Travel Safe, Explore More',
}) {
  const cfg = SIZES[size] ?? SIZES.md;
  const titleClass = variant === 'light' ? 'text-white' : 'text-slate-900';
  const taglineClass = variant === 'light' ? 'text-slate-400' : 'text-slate-500';

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className="flex shrink-0 items-center justify-center rounded-2xl bg-white/0"
        style={{ width: cfg.icon, height: cfg.icon }}
      >
        <LogoMark size={cfg.icon} />
      </span>
      {showText && (
        <span className="min-w-0 text-left leading-tight">
          <span className={`block font-bold tracking-tight ${cfg.title} ${titleClass}`}><span className="text-orange-500">TOURIST</span> SAFETY</span>
          {tagline && (
            <span className={`block font-medium capitalize ${cfg.tagline} ${taglineClass}`}>{tagline}</span>
          )}
        </span>
      )}
    </span>
  );
}

export { LogoMark };
