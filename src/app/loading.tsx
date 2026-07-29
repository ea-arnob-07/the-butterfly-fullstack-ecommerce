export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-white animate-pulse" style={{ minHeight: '85vh' }}>
        <div className="container-shell relative z-10 flex h-full min-h-[85vh] flex-col justify-center py-20">
          <div className="h-4 w-48 rounded-full bg-rose-200/60 mb-6" />
          <div className="h-20 w-3/4 max-w-2xl rounded-3xl bg-rose-200/60 mb-6" />
          <div className="h-5 w-96 rounded-full bg-stone-200 mb-3" />
          <div className="h-5 w-80 rounded-full bg-stone-200 mb-10" />
          <div className="flex gap-4">
            <div className="h-14 w-44 rounded-full bg-rose-300/60 animate-pulse" />
            <div className="h-14 w-36 rounded-full bg-stone-200 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="container-shell py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="h-3 w-24 rounded-full bg-rose-200 mb-4 animate-pulse" />
            <div className="h-12 w-64 rounded-2xl bg-stone-200 animate-pulse" />
          </div>
          <div className="h-9 w-28 rounded-full bg-rose-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[2rem] bg-white shadow-sm animate-pulse" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="aspect-[4/5] bg-gradient-to-br from-rose-50 to-pink-100" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 rounded-full bg-rose-100" />
                <div className="h-4 w-1/2 rounded-full bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
