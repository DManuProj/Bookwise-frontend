import { cn } from "@/lib/utils";
import type { CustomerStats } from "@/types";

const CustomersStatsStrip = ({ stats }: { stats: CustomerStats }) => {
  const rows = [
    {
      label: "Total",
      value: stats.total,
      text: "text-foreground",
      dot: "bg-foreground/60",
    },
    {
      label: "New this month",
      value: stats.newThisMonth,
      text: "text-brand-600 dark:text-brand-400",
      dot: "bg-brand-500",
    },
    {
      label: "Returning",
      value: stats.returning,
      text: "text-blue-600 dark:text-blue-400",
      dot: "bg-blue-500",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {rows.map((stat) => (
        <div
          key={stat.label}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5"
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", stat.dot)} />
          <span className={cn("text-sm font-bold tabular-nums", stat.text)}>
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomersStatsStrip;
