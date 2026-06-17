"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle2, XCircle, Ban } from "lucide-react";
import { useUpdateLeaveStatus, useCancelLeave } from "@/hooks/api/useLeave";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { Leave } from "@/types/leave";

interface Props {
  leave: Leave;
  isAdmin: boolean;
  currentUserId: string;
}

const LeaveRowActions = ({ leave, isAdmin, currentUserId }: Props) => {
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateLeaveStatus();
  const { mutate: cancelLeave, isPending: isCancelling } = useCancelLeave();

  const isPending = isUpdating || isCancelling;

  const [confirmModal, setConfirmModal] = useState<null | "reject" | "cancel">(
    null,
  );

  // Only PENDING rows have any actions
  if (leave.status !== "PENDING" && leave.status !== "APPROVED") {
    return <span className="text-xs text-muted-foreground"></span>;
  }

  const isOwnRow = leave.userId === currentUserId;
  const isPendingStatus = leave.status === "PENDING";
  const canManageOthers = isAdmin && !isOwnRow && isPendingStatus;
  const canCancel = isOwnRow || isAdmin;

  // Nothing to render? Bail out.
  if (!canManageOthers && !canCancel) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const handleApprove = () => {
    updateStatus({ id: leave.id, status: "APPROVED" });
  };

  const handleRejectConfirm = () => {
    updateStatus({ id: leave.id, status: "REJECTED" });
    setConfirmModal(null);
  };

  const handleCancelConfirm = () => {
    cancelLeave(leave.id);
    setConfirmModal(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            disabled={isPending}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Leave #{leave.id.slice(0, 6)}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Approve — admin only, not own */}
          {canManageOthers && (
            <DropdownMenuItem
              onClick={handleApprove}
              className="gap-2 text-brand-600 dark:text-brand-400 focus:text-brand-600 focus:bg-brand-500/8"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </DropdownMenuItem>
          )}

          {/* Reject — admin only, not own */}
          {canManageOthers && (
            <DropdownMenuItem
              onClick={() => setConfirmModal("reject")}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </DropdownMenuItem>
          )}

          {/* Cancel — own (any role) or admin (any pending) */}
          {canCancel && (
            <>
              {canManageOthers && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => setConfirmModal("cancel")}
                className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/8"
              >
                <Ban className="h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reject confirmation */}
      <ConfirmationModal
        isLoading={isUpdating}
        open={confirmModal === "reject"}
        onConfirm={handleRejectConfirm}
        onOpenChange={(open) => setConfirmModal(open ? "reject" : null)}
        title="Reject leave request"
        description={`Reject ${leave.user.firstName} ${leave.user.lastName}'s leave request? They'll be notified.`}
      />

      {/* Cancel confirmation */}
      <ConfirmationModal
        isLoading={isCancelling}
        open={confirmModal === "cancel"}
        onConfirm={handleCancelConfirm}
        onOpenChange={(open) => setConfirmModal(open ? "cancel" : null)}
        title="Cancel leave request"
        description={
          isOwnRow
            ? "Cancel your leave request? This can't be undone."
            : `Cancel ${leave.user.firstName} ${leave.user.lastName}'s leave request? They'll be notified.`
        }
      />
    </>
  );
};

export default LeaveRowActions;
