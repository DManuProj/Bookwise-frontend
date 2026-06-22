type Props = {
  total: number;
  active: number;
  inactive: number;
};

const ServicesStatsStrip = ({ total, active, inactive }: Props) => {
  const rows = [
    {
      label: "Total",
      value: total,
      text: "text-foreground",
      dot: "bg-foreground/60",
    },
    {
      label: "Active",
      value: active,
      text: "text-brand-600 dark:text-brand-400",
      dot: "bg-brand-500",
    },
    {
      label: "Inactive",
      value: inactive,
      text: "text-muted-foreground",
      dot: "bg-muted-foreground/50",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {rows.map((stat) => (
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

export default ServicesStatsStrip;
