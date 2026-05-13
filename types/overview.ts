import type { BookingStatus } from "./enums";
import type { AuditAction } from "./enums";

// ═══════════════════════════════════════════════════
// SLIM SHAPES used inside the overview response
// (not the full Booking / Service / User entities)
// ═══════════════════════════════════════════════════

export type OverviewUpcomingBooking = {
  id: string;
  startAt: string; // ISO string (JSON serialization of Date)
  status: BookingStatus;
  customer: { id: string; name: string };
  service: { id: string; name: string };
  user: { id: string; firstName: string; lastName: string } | null;
};

export type OverviewActivityItem = {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  actorName: string | null;
  metadata: Record<string, unknown> | null; // backend stores arbitrary JSON
  createdAt: string;
  orgId: string;
  userId: string | null;
};

// ═══════════════════════════════════════════════════
// STATS BLOCK
// ═══════════════════════════════════════════════════

export type OverviewStats = {
  todayBookings: {
    total: number;
    pending: number;
  };
  monthBookings: {
    total: number;
  };
  services: {
    active: number;
    inactive: number;
  };
  staff: {
    total: number;
    pendingInvitations: number;
  };
};

// ═══════════════════════════════════════════════════
// CHART DATA
// ═══════════════════════════════════════════════════

export type OverviewBookingsByStatus = {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
};

export type OverviewTopService = {
  id: string;
  name: string;
  bookingCount: number;
};

// ═══════════════════════════════════════════════════
// FULL RESPONSE
// ═══════════════════════════════════════════════════

export type DashboardOverview = {
  stats: OverviewStats;
  pendingBookingsCount: number;
  bookingsByStatus: OverviewBookingsByStatus;
  topServices: OverviewTopService[];
  upcomingToday: OverviewUpcomingBooking[];
  recentActivity: OverviewActivityItem[];
};
