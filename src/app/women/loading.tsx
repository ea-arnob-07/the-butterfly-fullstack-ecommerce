export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-100 to-pink-50 animate-pulse" style={{ minHeight: '340px' }}>
        <div className="container-shell relative z-10 flex h-full items-center py-16 md:py-20">
          <div className="w-full max-w-xl">
            <div className="h-4 w-32 rounded-full bg-rose-200/60 mb-4" />
            <div className="h-14 w-80 rounded-2xl bg-rose-200/60 mb-5" />
            <div className="h-4 w-64 rounded-full bg-rose-200/60 mb-2" />
            <div className="h-4 w-52 rounded-full bg-rose-200/60" />
          </div>
        </div>
      </div>

      {/* Category pills skeleton */}
      <div className="container-shell pt-8 pb-2">
        <div className="flex gap-3 flex-wrap">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-9 w-28 rounded-full bg-rose-100 animate-pulse" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="container-shell py-8">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[2rem] bg-white shadow-sm animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="aspect-[4/5] bg-gradient-to-br from-rose-50 to-pink-100" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 rounded-full bg-rose-100" />
                <div className="h-4 w-1/2 rounded-full bg-stone-100" />
                <div className="h-3 w-full rounded-full bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
