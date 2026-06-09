export default function RiskIndicator({ level = 'low', label }) {
  const map = {
    low: { bar: 'bg-emerald-500', text: 'Low risk', width: '33%' },
    medium: { bar: 'bg-amber-500', text: 'Medium risk', width: '66%' },
    high: { bar: 'bg-rose-500', text: 'High risk', width: '100%' },
  };
  const cfg = map[level] ?? map.low;
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-semibold">{cfg.text}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: cfg.width }} />
      </div>
    </div>
  );
}
