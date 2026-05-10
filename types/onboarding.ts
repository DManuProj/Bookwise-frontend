import type { WorkingHour } from "./organisation";
import type { StaffFormInputs } from "./staff";
import type { ServiceFormInputs } from "./service";

// ═══════════════════════════════════════════════════
// ONBOARDING — flat structure matching backend OnboardingDto
// ═══════════════════════════════════════════════════

export type OnboardingData = {
  // Business info (Step 1) — flat fields, no wrapper
  businessName: string;
  slug: string;
  businessType: string;
  phone: string;
  description?: string;
  address?: string;
  country: string;
  currency: string;
  logo: File | null; // frontend-only, stripped before submit

  // Working hours (Step 2)
  workingHours: WorkingHour[];

  // Staff (Step 3) — array of form inputs
  staff: StaffFormInputs[];

  // Services (Step 4) — array of form inputs
  services: ServiceFormInputs[];
};
