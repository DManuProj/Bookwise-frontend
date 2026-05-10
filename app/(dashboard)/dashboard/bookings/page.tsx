"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import { useBookings } from "@/hooks/api/useBookings";
import { useDebounce } from "@/hooks/useDebounce";
import {
  BookingsFilters as ApiFilters,
  BookingStatus,
  FilterState,
} from "@/types";
import BookingsStatsStrip from "@/components/dashboard/bookings/BookingsStatsStrip";
import BookingsTable from "@/components/dashboard/bookings/BookingsTable";
import BookingsEmptyState from "@/components/dashboard/bookings/BookingsEmptyState";
import BookingsFilters from "@/components/dashboard/bookings/BookingsFilters";
import NewBookingModal from "@/components/dashboard/bookings/NewBookingModal";
import BookingsTableSkeleton from "@/components/dashboard/bookings/BookingsTableSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "all",
  date: "all",
  staff: "all",
  page: 1,
  pageSize: 10,
};

// Convert UI filter state → API params
const buildApiFilters = (state: FilterState, search: string): ApiFilters => {
  const apiFilters: ApiFilters = {
    page: state.page,
    limit: state.pageSize,
  };

  if (search.trim()) apiFilters.search = search.trim();
  if (state.status !== "all") apiFilters.status = state.status as BookingStatus;
  if (state.staff !== "all") apiFilters.staffId = state.staff;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (state.date) {
    case "today": {
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      apiFilters.from = today.toISOString();
      apiFilters.to = end.toISOString();
      break;
    }
    case "tomorrow": {
      const start = new Date(today);
      start.setDate(start.getDate() + 1);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      apiFilters.from = start.toISOString();
      apiFilters.to = end.toISOString();
      break;
    }
    case "week": {
      const end = new Date(today);
      end.setDate(end.getDate() + 7);
      apiFilters.from = today.toISOString();
      apiFilters.to = end.toISOString();
      break;
    }
    case "month": {
      const end = new Date(today);
      end.setMonth(end.getMonth() + 1);
      apiFilters.from = today.toISOString();
      apiFilters.to = end.toISOString();
      break;
    }
  }

  return apiFilters;
};

const BookingsPage = () => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [newBookingOpen, setNewBookingOpen] = useState(false);

  //  Debounce search (don't fire API call on every keystroke)
  const debouncedSearch = useDebounce(filters.search, 400);

  //  Build API params, memoized so query key is stable
  const apiFilters = useMemo(
    () => buildApiFilters(filters, debouncedSearch),
    [filters, debouncedSearch],
  );

  // Fetch — hook handles loading, caching, refetching
  const { data, isPending, isFetching } = useBookings(apiFilters);
  const isLoading = isPending;

  //  Derived values
  const bookings = data?.data ?? [];
  const stats = data?.stats;
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.date !== "all" ||
    filters.staff !== "all";

  //  Handlers — separate "filter changed" vs "page changed"
  const updateFilters = (changes: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...changes, page: 1 }));
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleClear = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all appointments.
          </p>
        </div>
        <Button
          disabled={isLoading}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg h-11 shadow-sm shadow-brand-500/20"
          onClick={() => setNewBookingOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Booking
        </Button>
      </div>

      {/* Filters */}
      <BookingsFilters
        filters={filters}
        onChange={(changes) => updateFilters(changes)}
        onClear={handleClear}
        hasActive={hasActiveFilters}
        disabled={isLoading}
      />

      {/* Stats strip + count */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {stats && <BookingsStatsStrip stats={stats} />}

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Showing {bookings.length} of {total} bookings
          </span>
          <Select
            disabled={isLoading}
            value={filters.pageSize.toString()}
            onValueChange={(v) => updateFilters({ pageSize: parseInt(v, 10) })}
          >
            <SelectTrigger className="h-9 w-36 whitespace-nowrap">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table / skeleton */}
      <div>
        {isLoading ? (
          <BookingsTableSkeleton rows={5} />
        ) : bookings.length > 0 ? (
          <BookingsTable bookings={bookings} />
        ) : (
          <BookingsEmptyState
            hasFilters={hasActiveFilters}
            onClear={handleClear}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(Math.max(1, filters.page - 1))}
                className={
                  filters.page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground px-4">
                Page {filters.page} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(Math.min(totalPages, filters.page + 1))}
                className={
                  filters.page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <NewBookingModal
        open={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
      />
    </div>
  );
};

export default BookingsPage;
