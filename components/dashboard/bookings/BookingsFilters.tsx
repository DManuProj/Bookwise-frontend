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
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          disabled={disabled}
          placeholder="Search customer or service..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Status */}
      <Select
        disabled={disabled}
        value={filters.status}
        onValueChange={(v) => set("status", v)}
      >
        <SelectTrigger className="h-9 w-full sm:w-36">
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
              "flex h-9 w-full sm:w-56 items-center gap-2 rounded-md border px-3 text-sm text-left transition-colors",
              "border-input bg-transparent",
              "hover:border-gray-400 dark:hover:border-teal-400",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
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
          <div className="border-t p-2 flex justify-end">
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
        <SelectTrigger className="h-9 w-full sm:w-36">
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
          className="h-9 px-3 text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default BookingsFilters;
