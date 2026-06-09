export default function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-landing-primary">{eyebrow}</p>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-base leading-relaxed text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
