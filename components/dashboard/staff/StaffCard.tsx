import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Clock, ShieldCheck, Crown, User } from "lucide-react";
import StaffCardActions from "@/components/dashboard/staff/StaffCardActions";
import type { StaffMember } from "@/types";

/* ── Role config ── */
const ROLE_CONFIG = {
  OWNER: {
    label: "Owner",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
    icon: Crown,
  },
  ADMIN: {
    label: "Admin",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0",
    icon: ShieldCheck,
  },
  MEMBER: {
    label: "Member",
    className: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
    icon: User,
  },
};

/* ── Status config ── */
const STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
  },
  pending: {
    label: "Invite pending",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
  },
};

type Props = {
  member: StaffMember;
  onEdit: (member: StaffMember) => void;
  onRemove: (id: string) => void;
};

const StaffCard = ({ member, onEdit, onRemove }: Props) => {
  const role = ROLE_CONFIG[member.role];
  const status = STATUS_CONFIG[member.status ?? "active"];
  const RoleIcon = role.icon;

  const initials = member.name
    ? member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : member.email.slice(0, 2).toUpperCase();

  return (
    <Card
      className={`border-brand-500/20 dark:border-brand-500/10 transition-all duration-200 ${
        member.status === "pending" ? "opacity-75" : ""
      }`}
    >
      <CardContent className="p-5">
        {/* Top row — avatar + actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-11 w-11 ring-2 ring-brand-500/15">
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Online dot */}
              {member.status === "active" && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-brand-500 ring-2 ring-background" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {member.name || "—"}
              </p>
              <Badge className={`text-xs mt-1 ${role.className}`}>
                <RoleIcon className="h-3 w-3 mr-1" />
                {role.label}
              </Badge>
            </div>
          </div>

          {/* No actions for owner */}
          {!member.isOwner && (
            <StaffCardActions
              member={member}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          )}
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground truncate">
            {member.email}
          </p>
        </div>

        {/* Footer row — status + joined */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Badge className={`text-xs ${status.className}`}>
            {status.label}
          </Badge>
          {member.joinedAt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Joined {member.joinedAt}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffCard;
