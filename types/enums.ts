import { z } from "zod";

// ═══════════════════════════════════════════════════
// ENUMS — match backend exactly (uppercase, same names)
// ═══════════════════════════════════════════════════

export const RoleEnum = z.enum(["OWNER", "ADMIN", "MEMBER"]);
export type Role = z.infer<typeof RoleEnum>;

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW"
  | "RESCHEDULED";

export type BookingSource = "MANUAL_CUSTOMER" | "VOICE_AI" | "MANUAL_DASHBOARD";

export type PlanTier = "STARTER" | "PRO" | "BUSINESS";

export type InviteStatus =
  | "PENDING"
  | "ACCEPTED"
  | "EXPIRED"
  | "RESENT"
  | "CANCELLED";

export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
