export default function Loading() {
  return (
    <div className="min-h-screen py-8 md:py-14">
      {/* Breadcrumb skeleton */}
      <div className="container-shell mb-8">
        <div className="flex items-center gap-2">
          <div className="h-3 w-10 rounded-full bg-stone-200 animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-stone-200 animate-pulse" />
          <div className="h-3 w-16 rounded-full bg-stone-200 animate-pulse" />
          <div className="h-3 w-3 rounded-full bg-stone-200 animate-pulse" />
          <div className="h-3 w-24 rounded-full bg-stone-200 animate-pulse" />
        </div>
      </div>

      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Gallery skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
            <div className="order-2 hidden gap-2 sm:order-1 sm:flex sm:flex-col">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[90px] w-[90px] shrink-0 rounded-xl bg-stone-200 animate-pulse" style={{ animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
            <div className="order-1 sm:order-2 flex-1 overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-50 to-stone-100 animate-pulse" style={{ aspectRatio: '4/5', minHeight: '420px' }} />
          </div>

          {/* Info skeleton */}
          <div className="space-y-5 py-4">
            <div className="h-3 w-28 rounded-full bg-rose-200 animate-pulse" />
            <div className="h-12 w-3/4 rounded-2xl bg-stone-200 animate-pulse" />
            <div className="h-10 w-40 rounded-full bg-rose-100 animate-pulse" />
            <div className="h-[1px] bg-stone-100 w-full" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-stone-100 animate-pulse" />
              <div className="h-4 w-5/6 rounded-full bg-stone-100 animate-pulse" />
              <div className="h-4 w-4/6 rounded-full bg-stone-100 animate-pulse" />
            </div>
            <div className="h-12 w-full rounded-2xl bg-stone-100 animate-pulse mt-4" />
            <div className="flex flex-wrap gap-2 mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-14 rounded-full bg-stone-100 animate-pulse" style={{ animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-20 rounded-full bg-stone-100 animate-pulse" style={{ animationDelay: `${i * 0.07}s` }} />
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-14 flex-1 rounded-full bg-rose-200 animate-pulse" />
              <div className="h-14 w-14 rounded-full bg-stone-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
