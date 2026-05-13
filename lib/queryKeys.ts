import { BookingsFilters, CustomersFilters } from "@/types";

/**
 * Centralized query keys for TanStack Query cache.
 *
 * Why centralize:
 *   - No typos: queryKeys.me vs ["me"] vs ["mee"] silently breaks cache
 *   - Single source of truth: rename a key in ONE place
 *   - Autocomplete in IDE
 *
 * As we build new features, add new keys here.
 */
export const queryKeys = {
  me: ["me"] as const,

  // slug check — used in onboarding step 1
  slugCheck: (slug: string) => ["slug-check", slug] as const,

  organisation: ["organisation"] as const,
  services: ["services"] as const,
  staff: ["staff"] as const,

  invitation: (token: string) => ["invitation", token] as const,

  customers: (filters?: CustomersFilters) => ["customers", filters] as const,
  customer: (id: string) => ["customer", id] as const,

  bookings: (filters: BookingsFilters) => ["bookings", filters] as const,
  bookingSlots: (
    serviceId: string,
    staffId: string,
    date: string,
    excludeBookingId?: string,
  ) =>
    [
      "booking-slots",
      serviceId,
      staffId,
      date,
      excludeBookingId ?? "",
    ] as const,

  overview: ["overview"] as const,

  //notificaton
  notifications: ["notifications"] as const,
} as const;
