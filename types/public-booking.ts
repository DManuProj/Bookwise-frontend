import { z } from "zod";
import type { PlanTier } from "./enums";
import type { Service } from "./service";
import type { WorkingHour } from "./organisation";

// ═══════════════════════════════════════════════════
// API RESPONSE SHAPE
// What GET /api/public/:slug returns
// ═══════════════════════════════════════════════════

export type PublicOrgStaff = {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
};

export type PublicOrgResponse = {
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  logo: string | null;
  address: string | null;
  aiBookingAvailable: boolean;
  services: Service[];
  staff: PublicOrgStaff[];
  workingHours: WorkingHour[];
};

// ═══════════════════════════════════════════════════
// ZOD SCHEMA — customer details form (Step 4)
// ═══════════════════════════════════════════════════

export const publicBookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  note: z.string().optional(),
});

export type BookingFormData = z.infer<typeof publicBookingFormSchema>;

export type SlugStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

export type PublicCreateBookingPayload = {
  slug: string;
  serviceId: string;
  staffId?: string; // omit for "no preference"
  date: string; // YYYY-MM-DD (org-local calendar day)
  time: string; // HH:MM 24h (org-local wall-clock)
  note?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
};

// Backend returns the booking (with included user). Keep loose for v1.
export type PublicBookingResponse = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  userId: string | null;
  user: { id: string; firstName: string; lastName: string } | null;
};
