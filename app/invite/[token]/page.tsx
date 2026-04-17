import type { Invitation } from "@/types";
import InviteValidState from "@/components/invite/InviteValidState";
import InviteExpiredState from "@/components/invite/InviteExpiredState";
import InviteUsedState from "@/components/invite/InviteUsedState";
import InviteInvalidState from "@/components/invite/InviteInvalidState";

/* ── Placeholder data — replace with API call ── */
const MOCK_INVITES: Record<string, Invitation> = {
  "valid-token": {
    token: "valid-token",
    businessName: "John's Salon",
    businessLogo: null,
    role: "MEMBER",
    invitedBy: "Alex Morgan",
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000),
    status: "valid",
  },
  "expired-token": {
    token: "expired-token",
    businessName: "John's Salon",
    businessLogo: null,
    role: "ADMIN",
    invitedBy: "Alex Morgan",
    expiresAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "expired",
  },
  "used-token": {
    token: "used-token",
    businessName: "John's Salon",
    businessLogo: null,
    role: "MEMBER",
    invitedBy: "Alex Morgan",
    expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "used",
  },
};

type Props = {
  params: Promise<{ token: string }>;
};

const InvitePage = async ({ params }: Props) => {
  const { token } = await params;

  // TODO: replace with real API call
  // const invite = await fetch(`/api/invitations/${token}`).then(r => r.json())

  const invite = MOCK_INVITES[token] ?? null;

  if (!invite) return <InviteInvalidState />;
  if (invite.status === "expired")
    return <InviteExpiredState invite={invite} />;
  if (invite.status === "used") return <InviteUsedState invite={invite} />;

  return <InviteValidState invite={invite} />;
};

export default InvitePage;
