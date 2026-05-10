import { Booking } from "./booking";

// Existing — backend's plain customer shape
export type Customer = {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  createdAt: string;
};

// List row — Customer + per-row aggregations
export type CustomerListRow = Customer & {
  totalBookings: number;
  lastVisit: string | null;
};

// Detail response — Customer + aggregations + booking history
export type CustomerDetail = Customer & {
  totalBookings: number;
  lastVisit: string | null;
  firstSeen: string;
  bookings: Booking[];
};

// Stats for the customers strip
export type CustomerStats = {
  total: number;
  newThisMonth: number;
  returning: number;
};

// List response
export type CustomersListResponse = {
  data: CustomerListRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: CustomerStats;
};

// Filter params for GET /customers
export type CustomersFilters = {
  search?: string;
  page?: number;
  limit?: number;
};

export type CustomersFilterState = {
  search: string;
  page: number;
  pageSize: number;
};
