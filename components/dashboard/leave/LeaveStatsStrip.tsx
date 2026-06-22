import { cn } from "@/lib/utils";
import { Leave } from "@/types/leave";

const LeaveStatsStrip = ({ leaves }: { leaves: Leave[] }) => {
  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "PENDING").length,
    approved: leaves.filter((l) => l.status === "APPROVED").length,
    rejected: leaves.filter((l) => l.status === "REJECTED").length,
    cancelled: leaves.filter((l) => l.status === "CANCELLED").length,
  };

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
      label: "Approved",
      value: stats.approved,
      text: "text-brand-600 dark:text-brand-400",
      dot: "bg-brand-500",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      text: "text-red-600 dark:text-red-400",
      dot: "bg-red-500",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      text: "text-slate-500 dark:text-slate-400",
      dot: "bg-slate-400",
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

export default LeaveStatsStrip;
