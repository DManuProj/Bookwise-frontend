import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Crown,
  ShieldCheck,
  User,
  Phone,
  MailX,
  RefreshCw,
} from "lucide-react";
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

/* ── Status config — updated to match new design ── */
const STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
    dot: "bg-brand-500",
  },
  inactive: {
    label: "Invitation sent",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
    dot: null,
  },
};

type Props = {
  staff: StaffMember[];
  onEdit: (member: StaffMember) => void;
  onRemove: (id: string) => void;
  onResend?: (id: string) => void;
};

const StaffTable = ({ staff, onEdit, onRemove, onResend }: Props) => {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
            <TableHead className="pl-5 text-xs font-medium w-[260px]">
              Member
            </TableHead>
            <TableHead className="text-xs font-medium">Phone</TableHead>
            <TableHead className="text-xs font-medium">Role</TableHead>
            <TableHead className="text-xs font-medium">Status</TableHead>
            <TableHead className="text-xs font-medium">Joined</TableHead>
            <TableHead className="w-[52px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => {
            const role = ROLE_CONFIG[member.role];
            const status = STATUS_CONFIG[member.status ?? "inactive"];
            const RoleIcon = role.icon;
            const isInactive = member.status === "inactive" || !member.status;

            const initials = member.name
              ? member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : member.email.slice(0, 2).toUpperCase();

            return (
              <TableRow
                key={member.id}
                className={`border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${
                  isInactive ? "opacity-60" : ""
                }`}
              >
                {/* Member — avatar + name + email */}
                <TableCell className="pl-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9 ring-2 ring-brand-500/15">
                        <AvatarImage src={member.photo} alt={member.name} />
                        <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online dot — active only */}
                      {!isInactive && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-background" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Phone */}
                <TableCell className="py-3">
                  {member.phone ? (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">
                        {member.phone}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <MailX className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                      <span className="text-xs text-muted-foreground/50">
                        Not set
                      </span>
                    </div>
                  )}
                </TableCell>

                {/* Role */}
                <TableCell className="py-3">
                  <Badge className={`text-xs ${role.className}`}>
                    <RoleIcon className="h-3 w-3 mr-1" />
                    {role.label}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${status.className}`}>
                      {status.label}
                    </Badge>
                    {/* Resend invite button — inactive + non-owner only */}
                    {isInactive && !member.isOwner && onResend && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onResend(member.id)}
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Resend
                      </Button>
                    )}
                  </div>
                </TableCell>

                {/* Joined */}
                <TableCell className="py-3">
                  <span className="text-sm text-muted-foreground">
                    {member.joinedAt ?? "—"}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3 pr-4">
                  {!member.isOwner && (
                    <StaffCardActions
                      member={member}
                      onEdit={onEdit}
                      onRemove={onRemove}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaffTable;
