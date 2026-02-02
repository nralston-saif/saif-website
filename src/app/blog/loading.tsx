export default function BlogLoading() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="mt-4 h-6 w-full bg-muted animate-pulse rounded" />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white/60 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-6 w-full bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
