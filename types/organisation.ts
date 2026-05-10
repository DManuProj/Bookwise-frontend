import { z } from "zod";
import type { PlanTier, DayOfWeek } from "./enums";

// ═══════════════════════════════════════════════════
// ENTITIES — what the backend RETURNS
// Match backend response shapes exactly
// ═══════════════════════════════════════════════════

export type Organisation = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  address: string | null;
  timezone: string;
  phone: string | null;
  businessType: string;
  bufferMins: number;
  minLeadTimeMins: number;
  maxPerSlot: number;
  cancelPolicy: string | null;
  planTier: PlanTier;
  createdAt: string;
};

export type WorkingHour = {
  day: DayOfWeek;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

// ═══════════════════════════════════════════════════
// API RESPONSE SHAPES
// What specific endpoints return
// ═══════════════════════════════════════════════════

export type OrganisationResponse = Organisation & {
  workingHours: WorkingHour[];
};

// ═══════════════════════════════════════════════════
// ZOD SCHEMAS — for forms (input validation)
// ═══════════════════════════════════════════════════

// Business info form
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
  address: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  currency: z.string().min(1, "Currency is required"),
});

export type BusinessFormInputs = z.infer<typeof businessFormSchema> & {
  logo?: File | null;
};
