"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CircleDot,
  CheckCircle2,
  XCircle,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { LeaveStatus } from "@/types";
import { Leave } from "@/types/leave";
import LeaveRowActions from "@/components/dashboard/leave/LeaveRowActions";

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<
  LeaveStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    icon: CircleDot,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-0",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: Ban,
    className: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-0",
  },
};

interface Props {
  leaves: Leave[];
  showStaffColumn: boolean;
  isAdmin: boolean;
  currentUserId: string;
}

const LeaveTable = ({
  leaves,
  showStaffColumn,
  isAdmin,
  currentUserId,
}: Props) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(leaves.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return leaves.slice(start, start + PAGE_SIZE);
  }, [leaves, safePage]);

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const sameDay =
      s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth() &&
      s.getDate() === e.getDate();

    if (sameDay) return format(s, "EEE, MMM d, yyyy");

    const sameYear = s.getFullYear() === e.getFullYear();
    return sameYear
      ? `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`
      : `${format(s, "MMM d, yyyy")} – ${format(e, "MMM d, yyyy")}`;
  };

  const formatDuration = (start: string, end: string) => {
    const days = differenceInCalendarDays(new Date(end), new Date(start)) + 1;
    return days === 1 ? "1 day" : `${days} days`;
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {showStaffColumn && (
                <TableHead className="w-[220px] pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Staff
                </TableHead>
              )}
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dates
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Duration
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reason
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((leave) => {
              const status = STATUS_CONFIG[leave.status];
              const StatusIcon = status.icon;
              const staffName = `${leave.user.firstName} ${leave.user.lastName}`;

              return (
                <TableRow
                  key={leave.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                >
                  {showStaffColumn && (
                    <TableCell className="px-6 py-3.5">
                      <p className="text-sm font-medium text-foreground">
                        {staffName}
                      </p>
                    </TableCell>
                  )}

                  <TableCell className="py-3.5">
                    <p className="text-sm text-foreground">
                      {formatDateRange(leave.startDate, leave.endDate)}
                    </p>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(leave.startDate, leave.endDate)}
                    </p>
                  </TableCell>

                  <TableCell className="max-w-[280px] py-3.5">
                    <p className="truncate text-sm text-muted-foreground">
                      {leave.reason || "—"}
                    </p>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge
                      className={cn(
                        "flex w-fit items-center gap-1 text-xs",
                        status.className,
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3.5 pr-4">
                    <LeaveRowActions
                      leave={leave}
                      isAdmin={isAdmin}
                      currentUserId={currentUserId}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination — only show if more than one page */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            Page {safePage} of {totalPages} · {leaves.length} total
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveTable;
