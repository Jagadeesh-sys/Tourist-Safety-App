import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function QuickActionCard({ to, icon: Icon, title, description, accent = 'brand' }) {
  const accents = {
    brand: 'from-brand-500/10 to-cyan-500/5 text-brand-600 dark:text-brand-400',
    emerald: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400',
    violet: 'from-violet-500/10 to-indigo-500/5 text-violet-600 dark:text-violet-400',
    rose: 'from-rose-500/10 to-orange-500/5 text-rose-600 dark:text-rose-400',
  };

  return (
    <Link
      to={to}
      className="group glass-panel flex items-start gap-4 p-4 transition hover:border-brand-200 hover:shadow-elevated dark:hover:border-brand-800"
    >
      <div className={`rounded-xl bg-gradient-to-br p-3 ${accents[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <FiArrowRight
        size={18}
        className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500 dark:text-slate-600"
      />
    </Link>
  );
}
