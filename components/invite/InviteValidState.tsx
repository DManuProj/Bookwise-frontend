import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  User,
  Clock,
  LayoutDashboard,
  CalendarDays,
  Bell,
} from "lucide-react";
import InviteShell from "@/components/invite/InviteShell";
import InviteCard from "@/components/invite/InviteCard";
import type { Invitation } from "@/types";

/* ── Helpers ── */
const getHoursLeft = (expiresAt: Date): number =>
  Math.max(
    0,
    Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)),
  );

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

type Props = { invite: Invitation };

const InviteValidState = ({ invite }: Props) => {
  const hoursLeft = getHoursLeft(invite.expiresAt);
  const isUrgent = hoursLeft < 6;
  const role = getRoleConfig(invite.role);
  const RoleIcon = role.icon;

  const initials = invite.businessName
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
            {invite.businessLogo && (
              <img
                src={invite.businessLogo}
                alt={invite.businessName}
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
            {invite.businessName}
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

        {/* Expiry */}
        {isUrgent ? (
          <Alert className="bg-amber-500/5 border-amber-500/20 mb-5 py-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
              This invitation expires in{" "}
              <span className="font-semibold">{hoursLeft} hours</span>. Accept
              soon!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center gap-1.5 justify-center mb-5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Expires in{" "}
              <span className="font-medium text-foreground">
                {hoursLeft} hours
              </span>
            </p>
          </div>
        )}

        {/* Accept */}
        <div className="space-y-3">
          <SignUpButton mode="modal" forceRedirectUrl="/profile/setup">
            <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl h-11 shadow-sm shadow-brand-500/20 text-sm font-semibold">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Accept Invitation
            </Button>
          </SignUpButton>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <SignInButton mode="modal" forceRedirectUrl="/profile/setup">
              <button className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                Sign in instead
              </button>
            </SignInButton>
          </p>
        </div>

        <Separator className="my-5" />

        <p className="text-center text-xs text-muted-foreground">
          Not expecting this invitation?{" "}
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Ignore it
          </Link>
        </p>
      </InviteCard>
    </InviteShell>
  );
};

export default InviteValidState;
