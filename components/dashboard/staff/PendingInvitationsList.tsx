"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  Clock,
  RefreshCw,
  MoreHorizontal,
  XCircle,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import type { StaffInvitation } from "@/types";
import { formatDistanceToNow, isPast } from "date-fns";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

const ROLE_CONFIG = {
  ADMIN: {
    label: "Admin",
    icon: ShieldCheck,
    className: "text-blue-600 dark:text-blue-400",
  },
  MEMBER: {
    label: "Member",
    icon: UserIcon,
    className: "text-brand-600 dark:text-brand-400",
  },
  OWNER: {
    label: "Owner",
    icon: ShieldCheck,
    className: "text-amber-600 dark:text-amber-400",
  },
};

type Props = {
  invitations: StaffInvitation[];
  isLoading?: boolean;
  isResending?: boolean;
  isCancelling?: boolean;
  onResend: (id: string) => void;
  onCancel: (id: string) => void;
};

const PendingInvitationsList = ({
  invitations,
  isLoading = false,
  isResending = false,
  isCancelling = false,
  onResend,
  onCancel,
}: Props) => {
  const [confirmCancel, setConfirmCancel] = useState<StaffInvitation | null>(
    null,
  );

  // Don't render the section at all if no invitations and not loading
  if (!isLoading && invitations.length === 0) return null;

  return (
    <>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">
          Pending Invitations
        </h2>
        {!isLoading && (
          <span className="text-xs text-muted-foreground">
            ({invitations.length})
          </span>
        )}
      </div>

      <div className="space-y-2">
        {isLoading
          ? // Skeleton cards
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border bg-muted/20"
              >
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))
          : invitations.map((invite) => {
              const role = ROLE_CONFIG[invite.role];
              const RoleIcon = role.icon;
              const initials = invite.email.slice(0, 2).toUpperCase();

              const expiresAt = new Date(invite.expiresAt);
              const expired = invite.status === "EXPIRED" || isPast(expiresAt);
              const expiryText = expired
                ? "Expired"
                : `Expires ${formatDistanceToNow(expiresAt, { addSuffix: true })}`;

              return (
                <div
                  key={invite.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border border-dashed transition-colors ${
                    expired
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border bg-muted/20 hover:bg-muted/30"
                  }`}
                >
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {invite.name || invite.email}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-xs font-medium flex items-center gap-1 ${role.className}`}
                      >
                        <RoleIcon className="h-3 w-3" />
                        {role.label}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span
                        className={`text-xs flex items-center gap-1 ${
                          expired
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {expiryText}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResend(invite.id)}
                      disabled={isResending}
                      className="h-8 px-3 text-xs text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Resend
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                          className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/8"
                          onClick={() => setConfirmCancel(invite)}
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel invite
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Confirm cancel */}
      <ConfirmationModal
        open={!!confirmCancel}
        onOpenChange={(open) => !open && setConfirmCancel(null)}
        title="Cancel Invitation"
        description={
          confirmCancel
            ? `The invitation to ${confirmCancel.email} will be cancelled. They won't be able to use the existing link.`
            : ""
        }
        confirmLabel="Cancel Invite"
        isLoading={isCancelling}
        onConfirm={() => {
          if (confirmCancel) {
            onCancel(confirmCancel.id);
            setConfirmCancel(null);
          }
        }}
      />
    </>
  );
};

export default PendingInvitationsList;
