const OverviewSkeleton = () => (
  <div className="mx-auto max-w-8xl animate-pulse space-y-6 p-6 lg:p-8">
    {/* Header */}
    <div className="space-y-2">
      <div className="h-7 w-40 rounded-lg bg-muted" />
      <div className="h-3.5 w-56 rounded bg-muted/60" />
    </div>

    {/* Stat cards */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="mb-4 h-10 w-10 rounded-xl bg-muted" />
          <div className="mb-2 h-7 w-16 rounded-lg bg-muted" />
          <div className="h-3 w-24 rounded bg-muted/60" />
        </div>
      ))}
    </div>

    {/* Main + side panel */}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Chart / table area */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-8 w-24 rounded-lg bg-muted/60" />
        </div>
        <div className="flex h-48 items-end gap-2">
          {[60, 85, 45, 95, 70, 55, 80].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-muted/50"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Side list */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-5 h-4 w-28 rounded bg-muted" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-2.5 w-20 rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default OverviewSkeleton;
