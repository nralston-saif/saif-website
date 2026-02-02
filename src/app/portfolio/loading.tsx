export default function PortfolioLoading() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl">
          <div className="h-10 w-48 bg-muted animate-pulse rounded" />
          <div className="mt-4 h-6 w-full bg-muted animate-pulse rounded" />
          <div className="mt-2 h-6 w-3/4 bg-muted animate-pulse rounded" />
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-white/60 p-6"
            >
              <div className="flex items-center justify-center h-24 mb-6">
                <div className="h-16 w-16 rounded-lg bg-muted animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <div className="h-5 w-32 mx-auto bg-muted animate-pulse rounded" />
                <div className="h-4 w-48 mx-auto bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
