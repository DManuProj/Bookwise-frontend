import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ShieldCheck,
  User,
  LayoutDashboard,
  CalendarDays,
  Bell,
} from "lucide-react";
import InviteShell from "@/components/invite/InviteShell";
import InviteCard from "@/components/invite/InviteCard";
import InviteAcceptActions from "@/components/invite/InviteAcceptActions";
import type { Invitation } from "@/types";

const getRoleConfig = (role: "ADMIN" | "MEMBER") =>
  role === "ADMIN"
    ? {
        label: "Admin",
        className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0",
        icon: ShieldCheck,
        desc: "Can manage bookings, services, staff and settings",
      }
    : {
        label: "Member",
        className:
          "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
        icon: User,
        desc: "Can view and manage their assigned bookings",
      };

type Props = {
  invite: Invitation;
  token: string;
};

const InviteValidState = ({ invite, token }: Props) => {
  const role = getRoleConfig(invite.role);
  const RoleIcon = role.icon;

  const initials = invite.orgName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <InviteShell>
      <InviteCard accent="brand">
        {/* Business info */}
        <div className="text-center mb-6">
          <Avatar className="h-16 w-16 rounded-2xl ring-2 ring-brand-500/20 mx-auto mb-4">
            {invite.orgLogo && (
              <img
                src={invite.orgLogo}
                alt={invite.orgName}
                className="w-full h-full object-cover"
              />
            )}
            <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xl font-bold rounded-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm text-muted-foreground mb-1">
            You've been invited to join
          </p>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {invite.orgName}
          </h1>

          <Badge className={`text-sm px-3 py-1 ${role.className}`}>
            <RoleIcon className="h-3.5 w-3.5 mr-1.5" />
            {role.label}
          </Badge>

          <p className="text-xs text-muted-foreground mt-3">{role.desc}</p>
        </div>

        {/* Invited by */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-px flex-1 bg-border" />
          <p className="text-xs text-muted-foreground px-2">
            Invited by{" "}
            <span className="font-medium text-foreground">
              {invite.invitedBy}
            </span>
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* What you get */}
        <div className="rounded-xl bg-muted/30 border border-border p-4 mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            When you accept you'll get
          </p>
          <div className="space-y-2.5">
            {[
              {
                icon: LayoutDashboard,
                text: "Access to the business dashboard",
              },
              { icon: CalendarDays, text: "View and manage your bookings" },
              { icon: Bell, text: "Receive booking notifications" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-brand-500" />
                </div>
                <p className="text-sm text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accept actions */}
        <InviteAcceptActions invite={invite} token={token} />
      </InviteCard>
    </InviteShell>
  );
};

export default InviteValidState;
