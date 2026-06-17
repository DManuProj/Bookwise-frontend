"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  CheckCircle2,
  ThumbsUp,
  UserX,
  XCircle,
  Pencil,
} from "lucide-react";
import type { Booking, BookingStatus } from "@/types";
import { useUpdateBooking } from "@/hooks/api/useBookings";
import { useState } from "react";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import NewBookingModal from "@/components/dashboard/bookings/NewBookingModal";

const BookingRowActions = ({
  booking,
  isPast = false,
}: {
  booking: Booking;
  isPast?: boolean;
}) => {
  const { status, id: bookingId } = booking;
  const { mutate: updateStatus, isPending } = useUpdateBooking();

  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleStatusChange = (newStatus: BookingStatus) => {
    updateStatus({ id: bookingId, status: newStatus });
  };

  const handleCancelConfirm = () => {
    updateStatus({ id: bookingId, status: "CANCELLED" });
    setOpenModal(false);
  };

  // Action visibility rules
  // Edit:         PENDING + not past
  // Confirm:      PENDING + not past
  // Mark Complete: CONFIRMED (any time) OR past PENDING (back-fill)
  // Mark No-Show: CONFIRMED (any time) OR past PENDING
  // Cancel:       PENDING or CONFIRMED (any time — past included so admin can close out)
  const canEdit = status === "PENDING" && !isPast;
  const canConfirm = status === "PENDING" && !isPast;
  const canMarkComplete =
    status === "CONFIRMED" || (status === "PENDING" && isPast);
  const canMarkNoShow =
    status === "CONFIRMED" || (status === "PENDING" && isPast);
  const canCancel = status === "PENDING" || status === "CONFIRMED";

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

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            Booking #{bookingId.slice(0, 6)}
            {isPast && (status === "PENDING" || status === "CONFIRMED") && (
              <span className="block text-[10px] text-orange-600 dark:text-orange-400 mt-0.5">
                Past booking — close it out
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {canEdit && (
            <DropdownMenuItem
              onClick={() => setEditOpen(true)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit booking
            </DropdownMenuItem>
          )}

          {canConfirm && (
            <DropdownMenuItem
              onClick={() => handleStatusChange("CONFIRMED")}
              className="gap-2 text-brand-600 dark:text-brand-400 focus:text-brand-600 focus:bg-brand-500/8"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm booking
            </DropdownMenuItem>
          )}

          {canMarkComplete && (
            <DropdownMenuItem
              onClick={() => handleStatusChange("COMPLETED")}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Mark as complete
            </DropdownMenuItem>
          )}

          {canMarkNoShow && (
            <DropdownMenuItem
              onClick={() => handleStatusChange("NO_SHOW")}
              className="gap-2"
            >
              <UserX className="h-4 w-4" />
              Mark as no-show
            </DropdownMenuItem>
          )}

          {canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpenModal(true)}
                className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/8"
              >
                <XCircle className="h-4 w-4" />
                Cancel booking
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        isLoading={isPending}
        open={openModal}
        onConfirm={handleCancelConfirm}
        onOpenChange={setOpenModal}
        title="Cancel booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
      />

      <NewBookingModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        booking={booking}
      />
    </>
  );
};

export default BookingRowActions;
