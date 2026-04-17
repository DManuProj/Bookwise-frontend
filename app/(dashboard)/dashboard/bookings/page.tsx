"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import BookingsStatsStrip from "@/components/dashboard/bookings/BookingsStatsStrip";
import BookingsTable, {
  BOOKINGS,
} from "@/components/dashboard/bookings/BookingsTable";
import BookingsEmptyState from "@/components/dashboard/bookings/BookingsEmptyState";
import BookingsFilters, {
  FilterState,
} from "@/components/dashboard/bookings/BookingsFilters";
import NewBookingModal from "@/components/dashboard/bookings/NewBookingModal";

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "all",
  date: "all",
  staff: "all",
};

const PAGE_SIZE = 8;

const BookingsPage = () => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [newBookingOpen, setNewBookingOpen] = useState(false);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.date !== "all" ||
    filters.staff !== "all";

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  /* ── Filter logic ── */
  const filtered = useMemo(() => {
    return BOOKINGS.filter((b) => {
      const matchSearch =
        filters.search === "" ||
        b.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        b.service.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchStatus =
        filters.status === "all" || b.status === filters.status;

      const matchDate =
        filters.date === "all" ||
        (filters.date === "today" && b.date === "Today") ||
        (filters.date === "tomorrow" && b.date === "Tomorrow") ||
        (filters.date === "week" &&
          ["Today", "Tomorrow", "Mon 24"].includes(b.date)) ||
        (filters.date === "month" && true);

      const matchStaff =
        filters.staff === "all" ||
        (filters.staff === "unassigned" && b.staff === null) ||
        b.staff === filters.staff;

      return matchSearch && matchStatus && matchDate && matchStaff;
    });
  }, [filters]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg h-11 shadow-sm shadow-brand-500/20"
          onClick={() => setNewBookingOpen(true)}
        >
          <Plus className="h-4 w-4 " />
          Add New Booking
        </Button>
      </div>

      {/* Filters */}
      <BookingsFilters
        filters={filters}
        onChange={(f) => {
          setFilters(f);
          setPage(1);
        }}
        onClear={handleClear}
        hasActive={hasActiveFilters}
      />

      {/* Stats strip + count */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <BookingsStatsStrip />
        <span className="text-xs text-muted-foreground">
          Showing {paginated.length} of {filtered.length} bookings
        </span>
      </div>

      {/* Table card */}
      <div>
        {paginated.length > 0 ? (
          <BookingsTable bookings={paginated} />
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground px-4">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages
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
