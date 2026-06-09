export default function Input({ label, hint, error, className = '', ...props }) {
  return (
    <label className={`block space-y-1.5 text-sm ${className}`}>
      {label && <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>}
      <input
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-brand-500 focus:border-brand-500 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800/50"
        {...props}
      />
      {hint && !error && <span className="text-xs text-slate-500">{hint}</span>}
      {error && <span className="text-xs text-rose-600">{error}</span>}
    </label>
  );
}
