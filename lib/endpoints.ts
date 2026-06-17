/**
 * Centralized API endpoint URLs.
 *
 * Why centralize:
 *   - Backend route changes → update ONE file, not 20
 *   - Autocomplete: endpoints.me vs typing "/api/v1/me" everywhere
 *   - Refactor-safe: rename in one place, all usages update
 */
export const endpoints = {
  me: "/api/v1/me",

  // onboarding
  onboarding: "/api/v1/onboarding",
  slugCheck: (slug: string) => `/api/v1/slug-check/${encodeURIComponent(slug)}`,

  // setting
  organisation: "/api/v1/organisation",
  organisationHours: "/api/v1/organisation/hours",

  // services
  services: "/api/v1/services",
  serviceById: (id: string) => `/api/v1/services/${id}`,

  // staff
  staff: "/api/v1/staff",
  staffInvite: "/api/v1/staff/invite",
  staffChangeRole: (id: string) => `/api/v1/staff/${id}/role`,
  staffRemove: (id: string) => `/api/v1/staff/${id}`,

  // invitations
  resendInvitation: (id: string) => `/api/v1/invitations/${id}/resend`,
  cancelInvitation: (id: string) => `/api/v1/invitations/${id}/cancel`,
  invitation: (token: string) => `/api/v1/invitations/${token}`,
  acceptInvitation: (token: string) => `/api/v1/invitations/accept/${token}`,

  // customers
  customers: "/api/v1/customers",
  customerById: (id: string) => `/api/v1/customers/${id}`,
  customerNotes: (id: string) => `/api/v1/customers/${id}/notes`,

  // bookings
  bookings: "/api/v1/bookings",
  updateBookingById: (id: string) => `/api/v1/bookings/${id}`,
  bookingSlots: "/api/v1/bookings/slots",

  //overview
  overview: "/api/v1/overview",

  //notification
  notifications: "/api/v1/notifications",
  markNotificationRead: (id: string) => `/api/v1/notifications/${id}/read`,
  markAllNotificationsRead: "/api/v1/notifications/read-all",

  // public booking
  publicOrg: (slug: string) => `/api/v1/public/${encodeURIComponent(slug)}`,
  publicSlots: (slug: string) =>
    `/api/v1/public/${encodeURIComponent(slug)}/slots`,
  publicBookings: "/api/v1/public/bookings",

  // billing
  billingStatus: "/api/v1/billing/status",
  billingSubscribe: "/api/v1/billing/subscribe",
  billingPortal: "/api/v1/billing/portal",
  billingUsage: "/api/v1/billing/usage",

  // leave
  leave: "/api/v1/leave",
  leaveById: (id: string) => `/api/v1/leave/${id}`,
} as const;
