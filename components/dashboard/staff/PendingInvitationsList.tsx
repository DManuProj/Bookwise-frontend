"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
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
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Mail className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-semibold text-foreground">
          Pending Invitations
        </h2>
        {!isLoading && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {invitations.length}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {isLoading
          ? // Skeleton cards
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-4"
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
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border border-dashed p-4 transition-colors",
                    expired
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border bg-muted/20 hover:bg-muted/30",
                  )}
                >
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-amber-500/10 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {invite.name || invite.email}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs font-medium",
                          role.className,
                        )}
                      >
                        <RoleIcon className="h-3 w-3" />
                        {role.label}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          expired
                            ? "font-medium text-destructive"
                            : "text-muted-foreground",
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {expiryText}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResend(invite.id)}
                      disabled={isResending}
                      className="h-8 rounded-lg px-3 text-xs text-muted-foreground hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Resend
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground data-[state=open]:border-brand-500/30 data-[state=open]:bg-brand-500/10 data-[state=open]:text-brand-600 dark:data-[state=open]:text-brand-400"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 rounded-xl p-1.5"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive [&>svg]:text-destructive"
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
