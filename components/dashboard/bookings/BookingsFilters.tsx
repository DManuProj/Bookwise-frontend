"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, X, CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { FilterState } from "@/types";
import { useStaff } from "@/hooks/api/useStaff";
import { cn } from "@/lib/utils";
import { useState } from "react";

const BookingsFilters = ({
  filters,
  onChange,
  onClear,
  hasActive,
  disabled = false,
}: {
  filters: FilterState;
  onChange: (changes: Partial<FilterState>) => void;
  onClear: () => void;
  hasActive: boolean;
  disabled?: boolean;
}) => {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ [key]: value });

  const { data: staffData, isPending } = useStaff();
  const [dateOpen, setDateOpen] = useState(false);

  // Display label for the date trigger
  const dateLabel = (() => {
    const { dateFrom, dateTo } = filters;
    if (!dateFrom && !dateTo) return "All dates";
    if (dateFrom && !dateTo) return format(dateFrom, "MMM d, yyyy");
    if (dateFrom && dateTo) {
      if (isSameDay(dateFrom, dateTo)) return format(dateFrom, "MMM d, yyyy");
      return `${format(dateFrom, "MMM d")} – ${format(dateTo, "MMM d, yyyy")}`;
    }
    return "All dates";
  })();

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl card-surface p-2.5 shadow-sm sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          disabled={disabled}
          placeholder="Search customer or service..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="h-10 rounded-xl border-transparent bg-muted/50 pl-9 focus-visible:border-brand-500/40 focus-visible:bg-card"
        />
      </div>

      {/* Status */}
      <Select
        disabled={disabled}
        value={filters.status}
        onValueChange={(v) => set("status", v)}
      >
        <SelectTrigger className="h-10 w-full rounded-xl sm:w-36">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
          <SelectItem value="NO_SHOW">No Show</SelectItem>
        </SelectContent>
      </Select>

      {/* Date range */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled || filters.stale}
            className={cn(
              "flex h-10 w-full items-center gap-2 rounded-xl border px-3 text-left text-sm transition-colors sm:w-56",
              "border-input bg-transparent",
              "hover:border-brand-500/40 hover:bg-brand-500/[0.04]",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span
              className={cn(
                "truncate",
                filters.dateFrom ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {filters.stale ? "Stale bookings" : dateLabel}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2">
            <Calendar
              mode="range"
              selected={{
                from: filters.dateFrom,
                to: filters.dateTo,
              }}
              onSelect={(range) => {
                onChange({
                  dateFrom: range?.from,
                  dateTo: range?.to,
                });
              }}
              numberOfMonths={1}
              className={cn(
                "[--cell-size:--spacing(9)]",
                "**:data-[selected-single=true]:bg-brand-500!",
                "**:data-[selected-single=true]:text-white!",
                "**:data-[range-start=true]:bg-brand-500!",
                "**:data-[range-start=true]:text-white!",
                "**:data-[range-end=true]:bg-brand-500!",
                "**:data-[range-end=true]:text-white!",
                "**:data-[range-middle=true]:bg-brand-500/15!",
                "**:data-[range-middle=true]:text-brand-600!",
                "dark:**:data-[range-middle=true]:text-brand-400!",
              )}
              initialFocus
            />
          </div>
          <div className="flex justify-end border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange({ dateFrom: undefined, dateTo: undefined });
                setDateOpen(false);
              }}
            >
              Clear dates
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Staff */}
      <Select
        disabled={disabled || isPending}
        value={filters.staff}
        onValueChange={(v) => set("staff", v)}
      >
        <SelectTrigger className="h-10 w-full rounded-xl sm:w-36">
          <SelectValue placeholder="All staff" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All staff</SelectItem>
          {staffData?.users.map((staff) => (
            <SelectItem key={staff.id} value={staff.id}>
              {`${staff.firstName} ${staff.lastName}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear */}
      {hasActive && (
        <Button
          disabled={disabled}
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-10 shrink-0 rounded-xl px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default BookingsFilters;
