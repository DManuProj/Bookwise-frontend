import type { Service } from "./service";
import type { WorkingHour } from "./organisation";

// ═══════════════════════════════════════════════════
// API RESPONSE SHAPES
// What specific endpoints return
// ═══════════════════════════════════════════════════

export type PublicOrgResponse = {
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  logo: string | null;
  address: string | null;
  currency: string;
  voiceAiEnabled: boolean;
  services: Service[];
  staff: Array<{
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
  }>;
  workingHours: WorkingHour[];
};

// ═══════════════════════════════════════════════════
// MISC
// ═══════════════════════════════════════════════════

export type SlugStatus =
  | "idle"
  | "checking"
  | "available"
  | "taken"
  | "invalid";
