import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  value: number;
  color: string;
};

const STATS: Stat[] = [
  { label: "Total", value: 94, color: "text-foreground" },
  { label: "Pending", value: 18, color: "text-amber-600 dark:text-amber-400" },
  {
    label: "Confirmed",
    value: 42,
    color: "text-brand-600 dark:text-brand-400",
  },
  {
    label: "Completed",
    value: 28,
    color: "text-slate-500 dark:text-slate-400",
  },
  { label: "Cancelled", value: 6, color: "text-red-600   dark:text-red-400" },
  { label: "No Show", value: 4, color: "text-rose-600  dark:text-rose-400" },
];

const BookingsStatsStrip = () => (
  <div className="flex items-center gap-1 flex-wrap">
    {STATS.map((stat, i) => (
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

export default BookingsStatsStrip;
