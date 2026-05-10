/**
 * Centralized API endpoint URLs.
 *
 * Why centralize:
 *   - Backend route changes → update ONE file, not 20
 *   - Autocomplete: endpoints.me vs typing "/api/me" everywhere
 *   - Refactor-safe: rename in one place, all usages update
 */
export const endpoints = {
  me: "/api/me",

  // onboarding
  onboarding: "/api/onboarding",
  slugCheck: (slug: string) => `/api/slug-check/${encodeURIComponent(slug)}`,

  // setting
  organisation: "/api/organisation",
  organisationHours: "/api/organisation/hours",

  // services
  services: "/api/services",
  serviceById: (id: string) => `/api/services/${id}`,

  // staff
  staff: "/api/staff",
  staffInvite: "/api/staff/invite",
  staffChangeRole: (id: string) => `/api/staff/${id}/role`,
  staffRemove: (id: string) => `/api/staff/${id}`,

  // invitations
  resendInvitation: (id: string) => `/api/invitations/${id}/resend`,
  cancelInvitation: (id: string) => `/api/invitations/${id}/cancel`,
  invitation: (token: string) => `/api/invitations/${token}`,
  acceptInvitation: (token: string) => `/api/invitations/accept/${token}`,

  // customers
  customers: "/api/customers",
  customerById: (id: string) => `/api/customers/${id}`,
  customerNotes: (id: string) => `/api/customers/${id}/notes`,

  // bookings
  bookings: "/api/bookings",
  updateBookingById: (id: string) => `/api/bookings/${id}`,
  bookingSlots: "/api/bookings/slots",
} as const;
