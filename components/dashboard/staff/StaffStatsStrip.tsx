type Props = {
  total: number;
  active: number;
  pending: number;
};

const StaffStatsStrip = ({ total, active, pending }: Props) => {
  const rows = [
    {
      label: "Total",
      value: total,
      text: "text-foreground",
      dot: "bg-foreground/60",
      show: true,
    },
    {
      label: "Active",
      value: active,
      text: "text-brand-600 dark:text-brand-400",
      dot: "bg-brand-500",
      show: true,
    },
    {
      label: "Pending invite",
      value: pending,
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
      show: pending > 0,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {rows
        .filter((s) => s.show)
        .map((stat) => (
          <div
            key={stat.label}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stat.dot}`} />
            <span className={`text-sm font-bold tabular-nums ${stat.text}`}>
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
    </div>
  );
};

export default StaffStatsStrip;
