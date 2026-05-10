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

const BookingRowActions = ({ booking }: { booking: Booking }) => {
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
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Edit — only if pending */}
          {status === "PENDING" && (
            <DropdownMenuItem
              onClick={() => setEditOpen(true)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit booking
            </DropdownMenuItem>
          )}

          {/* Confirm — only if pending */}
          {status === "PENDING" && (
            <DropdownMenuItem
              onClick={() => handleStatusChange("CONFIRMED")}
              className="gap-2 text-brand-600 dark:text-brand-400 focus:text-brand-600 focus:bg-brand-500/8"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm booking
            </DropdownMenuItem>
          )}

          {/* Mark complete — only if confirmed */}
          {status === "CONFIRMED" && (
            <DropdownMenuItem
              onClick={() => handleStatusChange("COMPLETED")}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Mark as complete
            </DropdownMenuItem>
          )}

          {/* Mark no-show — only if confirmed */}
          {status === "CONFIRMED" && (
            <DropdownMenuItem
              onClick={() => handleStatusChange("NO_SHOW")}
              className="gap-2"
            >
              <UserX className="h-4 w-4" />
              Mark as no-show
            </DropdownMenuItem>
          )}

          {/* Cancel — pending or confirmed only */}
          {(status === "PENDING" || status === "CONFIRMED") && (
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
