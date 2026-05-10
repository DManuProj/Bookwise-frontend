"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { CustomersFilters, CustomersFilterState } from "@/types";
import { useCustomers } from "@/hooks/api/useCustomers";
import { useDebounce } from "@/hooks/useDebounce";
import CustomersTable from "@/components/dashboard/customers/CustomersTable";
import CustomersStatsStrip from "@/components/dashboard/customers/CustomersStatsStrip";
import CustomersEmptyState from "@/components/dashboard/customers/CustomersEmptyState";
import CustomerDetailModal from "@/components/dashboard/customers/CustomerDetailModal";
import CustomersTableSkeleton from "@/components/dashboard/customers/CustomersTableSkeleton";

const DEFAULT_FILTERS: CustomersFilterState = {
  search: "",
  page: 1,
  pageSize: 10,
};

const buildApiFilters = (
  state: CustomersFilterState,
  search: string,
): CustomersFilters => {
  const apiFilters: CustomersFilters = {
    page: state.page,
    limit: state.pageSize,
  };
  if (search.trim()) apiFilters.search = search.trim();
  return apiFilters;
};

const CustomersPage = () => {
  const [filters, setFilters] = useState<CustomersFilterState>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const apiFilters = useMemo(
    () => buildApiFilters(filters, debouncedSearch),
    [filters, debouncedSearch],
  );

  const { data, isPending } = useCustomers(apiFilters);

  const customers = data?.data ?? [];
  const stats = data?.stats;
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const updateFilters = (changes: Partial<CustomersFilterState>) => {
    setFilters((prev) => ({ ...prev, ...changes, page: 1 }));
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const isLoading = isPending && !data;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Customers are added automatically when bookings are made.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, email or phone..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        {stats && <CustomersStatsStrip stats={stats} />}

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Showing {customers.length} of {total} customers
          </span>
          <Select
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

      <div>
        {isLoading ? (
          <CustomersTableSkeleton rows={5} />
        ) : customers.length > 0 ? (
          <CustomersTable customers={customers} onView={setSelectedId} />
        ) : (
          <CustomersEmptyState />
        )}
      </div>

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

      <CustomerDetailModal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        customerId={selectedId}
      />
    </div>
  );
};

export default CustomersPage;
