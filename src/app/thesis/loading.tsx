export default function ThesisLoading() {
  return (
    <div className="py-24">
      <div className="container">
        <div className="max-w-2xl">
          <div className="h-10 w-56 bg-muted animate-pulse rounded" />
          <div className="mt-4 h-6 w-full bg-muted animate-pulse rounded" />
          <div className="mt-2 h-6 w-3/4 bg-muted animate-pulse rounded" />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white/60 p-6">
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
