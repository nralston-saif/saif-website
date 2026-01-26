export default function TeamLoading() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl">
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="mt-4 h-6 w-full bg-muted animate-pulse rounded" />
          <div className="mt-2 h-6 w-2/3 bg-muted animate-pulse rounded" />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full bg-muted animate-pulse" />
              <div className="mt-6 h-6 w-32 mx-auto bg-muted animate-pulse rounded" />
              <div className="mt-2 h-4 w-24 mx-auto bg-muted animate-pulse rounded" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 mx-auto bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
