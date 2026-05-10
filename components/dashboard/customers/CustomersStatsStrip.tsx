import { cn } from "@/lib/utils";
import type { CustomerStats } from "@/types";

const CustomersStatsStrip = ({ stats }: { stats: CustomerStats }) => {
  const rows = [
    { label: "Total", value: stats.total, color: "text-foreground" },
    {
      label: "New this month",
      value: stats.newThisMonth,
      color: "text-brand-600 dark:text-brand-400",
    },
    {
      label: "Returning",
      value: stats.returning,
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {rows.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-1">
          {i > 0 && <span className="text-border text-sm mx-1">·</span>}
          <span className={cn("text-sm font-semibold", stat.color)}>
            {stat.value}
          </span>
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomersStatsStrip;
