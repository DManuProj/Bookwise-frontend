import { cn } from "@/lib/utils";
import type { BookingStats } from "@/types";

const BookingsStatsStrip = ({ stats }: { stats: BookingStats }) => {
  const rows = [
    {
      label: "Total",
      value: stats.total,
      text: "text-foreground",
      dot: "bg-foreground/60",
    },
    {
      label: "Pending",
      value: stats.pending,
      text: "text-amber-600 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      text: "text-brand-600 dark:text-brand-400",
      dot: "bg-brand-500",
    },
    {
      label: "Completed",
      value: stats.completed,
      text: "text-slate-500 dark:text-slate-400",
      dot: "bg-slate-400",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      text: "text-red-600 dark:text-red-400",
      dot: "bg-red-500",
    },
    {
      label: "No Show",
      value: stats.noShow,
      text: "text-rose-600 dark:text-rose-400",
      dot: "bg-rose-500",
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

export default BookingsStatsStrip;
