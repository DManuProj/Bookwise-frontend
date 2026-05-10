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
  useCancelInvitation, // ← will exist after you create it
} from "@/hooks/api/useStaff";

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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team and their roles.
          </p>
        </div>
        <Button
          onClick={() => setInviteOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg h-11 shadow-sm shadow-brand-500/20"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Staff
        </Button>
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
