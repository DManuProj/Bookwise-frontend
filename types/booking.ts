import { z } from "zod";
import type { BookingStatus, BookingSource } from "./enums";
import type { Customer } from "./customer";
import type { Service } from "./service";
import type { User } from "./user";

// ═══════════════════════════════════════════════════
// ENTITIES
// ═══════════════════════════════════════════════════

export type Booking = {
  id: string;
  orgId: string;
  customerId: string;
  serviceId: string;
  userId: string | null;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  source: BookingSource;
  note: string | null;
  createdAt: string;
  customer?: Customer;
  service?: Service;
  user?: User;
};

// ═══════════════════════════════════════════════════
// API RESPONSE SHAPES
// ═══════════════════════════════════════════════════

export type BookingStats = {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
};

export type BookingsListResponse = {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: BookingStats;
};

// ═══════════════════════════════════════════════════
// FILTER PARAMS
// ═══════════════════════════════════════════════════

export type BookingsFilters = {
  status?: BookingStatus;
  staffId?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

// ═══════════════════════════════════════════════════
// ZOD SCHEMAS — for forms
// ═══════════════════════════════════════════════════

export const bookingDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  note: z.string().optional(),
});

export type BookingFormInputs = z.infer<typeof bookingDetailsSchema>;

// Dashboard: owner creating manual booking (one-screen form)
export const dashboardBookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Enter a valid email address"),
  customerPhone: z.string().min(7, "Enter a valid phone number"),
  serviceId: z.string().min(1, "Please select a service"),
  staffId: z.string().min(1, "Please select a staff member"),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, "Please select a time slot"),
  note: z.string().optional(),
});

export type DashboardBookingInputs = z.infer<typeof dashboardBookingSchema>;

// Payload for POST /bookings
export type CreateBookingPayload = {
  serviceId: string;
  staffId?: string;
  startAt: string; // ISO string
  note?: string;
  customerId?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
};

// Payload for PUT /bookings/:id
export type UpdateBookingStatusPayload = {
  id: string;
  status: BookingStatus;
};

// Payload for PATCH /bookings/:id
export type EditBookingPayload = {
  id: string;
  serviceId?: string;
  staffId?: string;
  startAt?: string;
  note?: string;
};

export type FilterState = {
  search: string;
  status: string;
  date: string;
  staff: string;
  page: number;
  pageSize: number;
};
