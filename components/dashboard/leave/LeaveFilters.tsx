"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStaff } from "@/hooks/api/useStaff";
import { LeaveStatus } from "@/types";
import { LeaveFilters as LeaveFiltersType } from "@/types/leave";

type StatusOption = {
  value: "ACTIVE" | LeaveStatus | "ALL";
  label: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  { value: "ACTIVE", label: "Active (pending + approved)" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ALL", label: "All" },
];

interface Props {
  isAdmin: boolean;
  filters: LeaveFiltersType;
  statusFilter: StatusOption["value"];
  onStatusChange: (value: StatusOption["value"]) => void;
  onStaffChange: (userId: string | undefined) => void;
}

export default function LeaveFilters({
  isAdmin,
  filters,
  statusFilter,
  onStatusChange,
  onStaffChange,
}: Props) {
  const { data: staff } = useStaff();

  const currentStatusLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "Active";

  const currentStaffLabel = filters.userId
    ? (() => {
        const member = staff?.users.find((s) => s.id === filters.userId);
        return member ? `${member.firstName} ${member.lastName}` : "Staff";
      })()
    : "All staff";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* Status filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl font-normal data-[state=open]:border-brand-500/40 data-[state=open]:bg-brand-500/[0.04]"
          >
            <span className="text-xs text-muted-foreground">Status:</span>
            <span className="text-sm font-medium">{currentStatusLabel}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 rounded-xl p-1.5">
          <DropdownMenuLabel className="px-2 text-xs font-normal text-muted-foreground">
            Filter by status
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {STATUS_OPTIONS.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.value}
              checked={statusFilter === opt.value}
              onCheckedChange={() => onStatusChange(opt.value)}
              className="cursor-pointer rounded-lg"
            >
              {opt.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Staff filter — admin only */}
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-xl font-normal data-[state=open]:border-brand-500/40 data-[state=open]:bg-brand-500/[0.04]"
            >
              <span className="text-xs text-muted-foreground">Staff:</span>
              <span className="text-sm font-medium">{currentStaffLabel}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-xl p-1.5">
            <DropdownMenuLabel className="px-2 text-xs font-normal text-muted-foreground">
              Filter by staff
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={!filters.userId}
              onCheckedChange={() => onStaffChange(undefined)}
              className="cursor-pointer rounded-lg"
            >
              All staff
            </DropdownMenuCheckboxItem>
            {staff?.users.map((member) => (
              <DropdownMenuCheckboxItem
                key={member.id}
                checked={filters.userId === member.id}
                onCheckedChange={() =>
                  onStaffChange(
                    filters.userId === member.id ? undefined : member.id,
                  )
                }
                className="cursor-pointer rounded-lg"
              >
                {member.firstName} {member.lastName}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
