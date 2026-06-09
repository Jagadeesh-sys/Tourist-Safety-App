const levelStyles = {
  high: 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200',
  medium: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
  low: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
};

export default function GeoFenceCard({ alert }) {
  return (
    <div className={`rounded-2xl border p-4 ${levelStyles[alert.level] ?? levelStyles.medium}`}>
      <p className="text-xs font-bold uppercase tracking-wide">{alert.level} risk</p>
      <h3 className="mt-1 font-semibold">{alert.zone}</h3>
      <p className="mt-2 text-sm opacity-90">{alert.message}</p>
    </div>
  );
}
