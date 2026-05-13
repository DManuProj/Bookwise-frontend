const OverviewSkeleton = () => (
  <div className="p-4 lg:px-8 max-w-8xl mx-auto space-y-6 animate-pulse">
    <div className="h-8 w-40 bg-muted rounded" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-32 bg-muted/40 rounded-xl border border-border"
        />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 h-64 bg-muted/40 rounded-xl border border-border" />
      <div className="h-64 bg-muted/40 rounded-xl border border-border" />
    </div>
  </div>
);

export default OverviewSkeleton;
