import { z } from "zod";
import type { Role } from "./enums";
import type { Organisation } from "./organisation";

// ═══════════════════════════════════════════════════
// ENTITIES — what the backend RETURNS
// Match backend response shapes exactly
// ═══════════════════════════════════════════════════

export type UserStatus = "ACTIVE" | "INACTIVE" | "REMOVED";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  photoUrl: string | null;
  role: Role;
  status: UserStatus;
  orgId: string | null;
  profileComplete: boolean;
  createdAt: string;
  onboardingComplete: boolean;
};

// ═══════════════════════════════════════════════════
// API RESPONSE SHAPES
// What specific endpoints return
// ═══════════════════════════════════════════════════

export type MeResponse = User & {
  org: Organisation | null;
};

// ═══════════════════════════════════════════════════
// ZOD SCHEMAS — for forms (input validation)
// ═══════════════════════════════════════════════════

// Profile setup (staff completing their profile)
export const profileSetupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

export type ProfileSetupInputs = z.infer<typeof profileSetupSchema>;
