export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-16 animate-pulse border-b bg-white" />
      <div className="h-[560px] animate-pulse bg-slate-200" />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-16 md:px-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
