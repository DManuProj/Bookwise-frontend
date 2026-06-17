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
    { label: "Total", value: stats.total, color: "text-foreground" },
    {
      label: "Pending",
      value: stats.pending,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Approved",
      value: stats.approved,
      color: "text-brand-600 dark:text-brand-400",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      color: "text-red-600 dark:text-red-400",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      color: "text-slate-500 dark:text-slate-400",
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

export default LeaveStatsStrip;
