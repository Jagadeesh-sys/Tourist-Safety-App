export default function SafetyScore({ score = 0 }) {
  const color = score >= 85 ? 'text-emerald-500' : score >= 70 ? 'text-amber-500' : 'text-rose-500';
  return (
    <div className="glass-panel flex flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-medium text-slate-500">Safety Score</p>
      <p className={`mt-2 text-5xl font-extrabold ${color}`}>{score}</p>
      <p className="mt-2 max-w-xs text-xs text-slate-500">
        Composite score from incidents, GeoFence alerts, and route risk in your area.
      </p>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
