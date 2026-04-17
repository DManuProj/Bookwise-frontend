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

export type Service = ServiceFormInputs & {
  id: string;
  isActive: boolean;
};

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
  status?: "active" | "inactive";
  phone?: string;
  photo?: string;
  joinedAt?: string;
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
  services: ServiceFormInputs[];
};

export type OnboardingData = {
  businessInfo: Step1Data | null;
  businessHours: Step2Data | null;
  staffData: Step3Data | null;
  services: Step4Data | null;
};

// ── Customer ────────────────────────────────────────

export type BookingHistoryItem = {
  id: string;
  service: string;
  date: string;
  time: string;
  staff: string;
  status: BookingStatus;
};

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastVisit: string;
  firstSeen: string;
  notes: string;
  isNew: boolean;
  bookingHistory: BookingHistoryItem[];
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

export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  duration: z.number().min(1, "Duration is required"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(1, "Price is required"),
  buffer: z.number().min(0),
  description: z.string().optional(),
});

export type ServiceFormInputs = z.infer<typeof serviceSchema>;

// ── Public Booking ──────────────────────────────────

export type OrgService = {
  id: string;
  name: string;
  duration: number;
  price: number;
  buffer: number;
  description: string;
};

export type OrgStaff = {
  id: string;
  name: string;
  role: string;
  photo: string | null;
};

export type OrgData = {
  name: string;
  slug: string;
  description: string;
  phone: string;
  logo: string | null;
  address: string;
  services: OrgService[];
  staff: OrgStaff[];
  currency: string;
  voiceAiEnabled: boolean;
};

// ── Public Booking Form ─────────────────────────────

export const bookingDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  note: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingDetailsSchema>;

// ── Invitation ──────────────────────────────────────

export type InviteStatus = "valid" | "expired" | "used" | "invalid";

export type Invitation = {
  token: string;
  businessName: string;
  businessLogo: string | null;
  role: "ADMIN" | "MEMBER";
  invitedBy: string;
  expiresAt: Date;
  status: InviteStatus;
};

// ── staffProfile setup ────────────────────────────────────

export type ProfileSetupFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  photo?: File | null;
};
