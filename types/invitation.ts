import type { InviteStatus } from "./enums";

// ═══════════════════════════════════════════════════
// MISC
// ═══════════════════════════════════════════════════

export type Invitation = {
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  status: InviteStatus;
  orgName: string;
  orgLogo: string | null;
  invitedBy: string;
  expiresAt: string;
};
