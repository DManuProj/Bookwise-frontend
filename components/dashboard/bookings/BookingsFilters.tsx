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
import { Search, X } from "lucide-react";

export type FilterState = {
  search: string;
  status: string;
  date: string;
  staff: string;
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  hasActive: boolean;
};

const BookingsFilters = ({ filters, onChange, onClear, hasActive }: Props) => {
  const set = (key: keyof FilterState, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search customer or service..."
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Status */}
      <Select value={filters.status} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="h-9 w-full sm:w-36">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="no_show">No Show</SelectItem>
        </SelectContent>
      </Select>

      {/* Date range */}
      <Select value={filters.date} onValueChange={(v) => set("date", v)}>
        <SelectTrigger className="h-9 w-full sm:w-36">
          <SelectValue placeholder="All dates" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="tomorrow">Tomorrow</SelectItem>
          <SelectItem value="week">This week</SelectItem>
          <SelectItem value="month">This month</SelectItem>
        </SelectContent>
      </Select>

      {/* Staff */}
      <Select value={filters.staff} onValueChange={(v) => set("staff", v)}>
        <SelectTrigger className="h-9 w-full sm:w-36">
          <SelectValue placeholder="All staff" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All staff</SelectItem>
          <SelectItem value="James">James</SelectItem>
          <SelectItem value="Anna">Anna</SelectItem>
          <SelectItem value="You">You</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear */}
      {hasActive && (
        <Button
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
