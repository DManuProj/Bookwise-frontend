import { z } from "zod";

// ── Enums ──────────────────────────────────────────
export const RoleEnum = z.enum(["OWNER", "ADMIN", "MEMBER"]);
export type Role = z.infer<typeof RoleEnum>;

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"
  | "rescheduled";

export type BookingSource = "manual_customer" | "voice_ai" | "manual_dashboard";

export type PlanTier = "STARTER" | "PRO" | "BUSINESS";

// ── Core Types ─────────────────────────────────────
export interface Organisation {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  address?: string;
  timezone: string;
  phone?: string;
  bufferMins: number;
  minLeadTimeMins: number;
  maxPerSlot: number;
  cancelPolicy?: string;
  createdAt: string;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  phone?: string;
  photo?: string;
  role: Role;
  orgId?: string;
  onboardingComplete: boolean;
}

export interface Service {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  durationMins: number;
  price: number;
  isActive: boolean;
}

export interface Booking {
  id: string;
  orgId: string;
  customerId: string;
  serviceId: string;
  userId: string;
  startAt: string;
  endAt: string;
  status: BookingStatus;
  source: BookingSource;
  note?: string;
  createdAt: string;
  customer?: Customer;
  service?: Service;
  user?: User;
}

export interface Customer {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

// ── Onboarding ─────────────────────────────────────

export type WorkingHourRow = {
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isOwner: boolean;
};

export type OnboardingService = {
  id: string;
  name: string;
  duration: number;
  price: number;
  buffer: number;
  description: string;
  staffIds: string[];
};

export type SlugStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";

export type Step1Data = BusinessFormInputs & {
  logo: File | null;
};

export type Step2Data = {
  workingHours: WorkingHourRow[];
};

export type Step3Data = {
  staff: StaffMember[];
};

export type Step4Data = {
  services: OnboardingService[];
};

export type OnboardingData = {
  step1: Step1Data | null;
  step2: Step2Data | null;
  step3: Step3Data | null;
  step4: Step4Data | null;
};

/* ── Zod schema ── */
export const businessFormSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be under 30 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  businessType: z.string().min(1, "Please select a business type"),
  phone: z.string().min(7, "Enter a valid phone number"),
  description: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  currency: z.string().min(1, "Currency is required"),
});
export type BusinessFormInputs = z.infer<typeof businessFormSchema>;
