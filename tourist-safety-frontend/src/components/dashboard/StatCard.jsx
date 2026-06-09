export default function StatCard({ title, value, change, icon: Icon, tone = 'brand' }) {
  const tones = {
    brand: 'from-brand-500 to-cyan-600',
    rose: 'from-rose-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-600',
    violet: 'from-violet-500 to-indigo-600',
  };
  return (
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          {change && <p className="mt-1 text-xs text-emerald-600">{change}</p>}
        </div>
        {Icon && (
          <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-3 text-white shadow-lg`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
