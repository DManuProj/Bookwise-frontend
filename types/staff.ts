import { z } from "zod";
import { RoleEnum } from "./enums";
import type { Role, InviteStatus } from "./enums";
import type { User } from "./user";

// ═══════════════════════════════════════════════════
// ENTITIES — what the backend RETURNS
// Match backend response shapes exactly
// ═══════════════════════════════════════════════════

export type SendInvitation = {
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "MEMBER";
};

export type StaffResponse = {
  users: User[];
  invitations: StaffInvitation[];
};

// Pending invitation shape (matches Prisma StaffInvitation model)
export type StaffInvitation = {
  id: string;
  token: string; // backend returns this — okay to expose to org admins
  email: string;
  name: string;
  role: Role;
  status: InviteStatus;
  expiresAt: string;
  createdAt: string;
  orgId: string;
};

// ═══════════════════════════════════════════════════
// ZOD SCHEMAS — for forms (input validation)
// ═══════════════════════════════════════════════════

// Staff form (matches backend StaffDto exactly)
export const staffSchema = z.object({
  id: z.string(), // frontend-only (for React keys + UI)
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  role: RoleEnum,
  isOwner: z.boolean(), // frontend-only
});

export type StaffFormInputs = z.infer<typeof staffSchema>;
