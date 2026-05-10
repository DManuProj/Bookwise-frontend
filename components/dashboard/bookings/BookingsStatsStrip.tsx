import { cn } from "@/lib/utils";
import type { BookingStats } from "@/types";

const BookingsStatsStrip = ({ stats }: { stats: BookingStats }) => {
  const rows = [
    { label: "Total",     value: stats.total,     color: "text-foreground" },
    { label: "Pending",   value: stats.pending,   color: "text-amber-600 dark:text-amber-400" },
    { label: "Confirmed", value: stats.confirmed, color: "text-brand-600 dark:text-brand-400" },
    { label: "Completed", value: stats.completed, color: "text-slate-500 dark:text-slate-400" },
    { label: "Cancelled", value: stats.cancelled, color: "text-red-600   dark:text-red-400" },
    { label: "No Show",   value: stats.noShow,    color: "text-rose-600  dark:text-rose-400" },
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

export default BookingsStatsStrip;
