"use client";

import { useMemo, useState } from "react";
import { Plus, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLeave } from "@/hooks/api/useLeave";
import { useMe } from "@/hooks/api/useMe";
import LeaveFiltersComponent from "@/components/dashboard/leave/LeaveFilters";
import { Leave, LeaveFilters } from "@/types/leave";
import { LeaveStatus } from "@/types";
import LeaveTableSkeleton from "@/components/dashboard/leave/LeaveTableSkeleton";
import LeaveTable from "@/components/dashboard/leave/LeaveTable";
import LeaveStatsStrip from "@/components/dashboard/leave/LeaveStatsStrip";
import RequestLeaveModal from "@/components/dashboard/leave/RequestLeaveModal";

type StatusFilterValue = "ACTIVE" | LeaveStatus | "ALL";

export default function LeavePage() {
  const { data: me } = useMe();
  const isAdmin = me?.role === "OWNER" || me?.role === "ADMIN";

  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("ALL");
  const [staffFilter, setStaffFilter] = useState<string | undefined>(undefined);

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const isOwner = me?.role === "OWNER";

  // Translate UI filter → backend filter
  const apiFilters: LeaveFilters = useMemo(() => {
    const f: LeaveFilters = {};
    if (statusFilter !== "ACTIVE" && statusFilter !== "ALL") {
      f.status = statusFilter;
    }
    if (staffFilter) f.userId = staffFilter;
    return f;
  }, [statusFilter, staffFilter]);

  const { data: leaves, isPending } = useLeave(apiFilters);

  // Frontend post-filter for the virtual "ACTIVE" status
  const filteredLeaves = useMemo<Leave[]>(() => {
    if (!leaves) return [];
    if (statusFilter !== "ACTIVE") return leaves;
    return leaves.filter(
      (l) => l.status === "PENDING" || l.status === "APPROVED",
    );
  }, [leaves, statusFilter]);

  return (
    <div className="mx-auto max-w-8xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isAdmin ? "Staff Leave" : "My Leave"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "Manage time-off requests across your team."
              : "Track your time-off requests."}
          </p>
        </div>
        <Button
          onClick={() => setRequestModalOpen(true)}
          className="h-11 shrink-0 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 hover:-translate-y-0.5"
        >
          <Plus className=" h-4 w-4" />
          Request Leave
        </Button>
      </div>

      {/* Filters */}
      <LeaveFiltersComponent
        isAdmin={isAdmin}
        filters={apiFilters}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onStaffChange={setStaffFilter}
      />

      {!isPending && leaves && leaves.length > 0 && (
        <div className="mb-4">
          <LeaveStatsStrip leaves={leaves} />
        </div>
      )}
      {/* Table area */}
      {isPending ? (
        <LeaveTableSkeleton showStaffColumn={isAdmin} />
      ) : filteredLeaves.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <CalendarOff className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No leave requests
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            {statusFilter === "ALL"
              ? isAdmin
                ? "No leave requests yet."
                : "You haven't requested any leave yet."
              : "Try a different filter."}
          </p>
        </div>
      ) : (
        <LeaveTable
          leaves={filteredLeaves}
          showStaffColumn={isAdmin}
          isAdmin={isAdmin}
          currentUserId={me?.id ?? ""}
        />
      )}
      <RequestLeaveModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        isOwner={isOwner}
      />
    </div>
  );
}
