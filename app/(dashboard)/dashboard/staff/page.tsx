"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import type { User, SendInvitation } from "@/types";

import StaffStatsStrip from "@/components/dashboard/staff/StaffStatsStrip";
import StaffEmptyState from "@/components/dashboard/staff/StaffEmptyState";
import ActiveMembersTable from "@/components/dashboard/staff/ActiveMembersTable";
import PendingInvitationsList from "@/components/dashboard/staff/PendingInvitationsList";
import InviteStaffModal from "@/components/dashboard/staff/InviteStaffModal";
import EditRoleModal from "@/components/dashboard/staff/EditRoleModal";

import {
  useStaff,
  useStaffInvite,
  useStaffChangeRole,
  useDeleteStaff,
  useResendInvitation,
  useCancelInvitation,
} from "@/hooks/api/useStaff";
import { useTierUsage } from "@/hooks/api/useBilling";
import Link from "next/link";

const StaffPage = () => {
  const { data, isPending } = useStaff();
  const { mutate: inviteUser, isPending: isInviting } = useStaffInvite();
  const { mutate: changeRole, isPending: isChangingRole } =
    useStaffChangeRole();
  const { mutate: removeStaff, isPending: isRemoving } = useDeleteStaff();
  const { mutate: resendInvite, isPending: isResending } =
    useResendInvitation();
  const { mutate: cancelInvite, isPending: isCancelling } =
    useCancelInvitation();

  const { data: usage } = useTierUsage();
  const atCap = usage?.staff.atCap ?? false;

  const users = data?.users ?? [];
  const invitations = data?.invitations ?? [];

  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  /* ── Stats ── */
  const total = users.length + invitations.length;
  const activeCount = users.length;
  const pendingCount = invitations.length;

  /* ── Handlers ── */
  const handleInvite = (data: SendInvitation) => {
    inviteUser(data, {
      onSuccess: () => setInviteOpen(false),
    });
  };

  const handleEditRole = (user: User) => {
    setEditUser(user);
  };

  const handleSaveRole = (id: string, role: "ADMIN" | "MEMBER") => {
    changeRole({ id, role }, { onSuccess: () => setEditUser(null) });
  };

  const handleRemoveUser = (id: string) => {
    removeStaff(id);
  };

  const handleResendInvite = (id: string) => {
    resendInvite(id);
  };

  const handleCancelInvite = (id: string) => {
    cancelInvite(id);
  };

  /* ── Empty state — no users AND no invites AND not loading ── */
  const isEmpty = !isPending && users.length === 0 && invitations.length === 0;

  return (
    <div className="mx-auto max-w-8xl space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Staff
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your team and their roles.
          </p>
        </div>
        {atCap ? (
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {usage?.staff.used} / {usage?.staff.limit} staff used
            </span>
            <Button
              asChild
              className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 hover:-translate-y-0.5"
            >
              <Link href="/dashboard/settings/billing">
                <UserPlus className="mr-2 h-4 w-4" />
                Upgrade to add more
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setInviteOpen(true)}
            className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 hover:-translate-y-0.5"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Staff
          </Button>
        )}
      </div>

      {/* Stats — only when we have data */}
      {!isPending && total > 0 && (
        <StaffStatsStrip
          total={total}
          active={activeCount}
          pending={pendingCount}
        />
      )}

      {/* Empty state — no staff at all */}
      {isEmpty ? (
        <StaffEmptyState onInvite={() => setInviteOpen(true)} />
      ) : (
        <div className="space-y-8">
          {/* Active members — always render (with skeleton if loading) */}
          <ActiveMembersTable
            users={users}
            isLoading={isPending}
            isRemoving={isRemoving}
            onEditRole={handleEditRole}
            onRemove={handleRemoveUser}
          />

          {/* Pending invitations — only renders if invites exist or loading */}
          <PendingInvitationsList
            invitations={invitations}
            isLoading={isPending}
            isResending={isResending}
            isCancelling={isCancelling}
            onResend={handleResendInvite}
            onCancel={handleCancelInvite}
          />
        </div>
      )}

      {/* Invite modal */}
      <InviteStaffModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
        isSubmitting={isInviting}
      />

      {/* Edit role modal */}
      <EditRoleModal
        open={true}
        onClose={() => setEditUser(null)}
        member={editUser}
        onSave={handleSaveRole}
        isSubmitting={isChangingRole}
      />
    </div>
  );
};

export default StaffPage;
