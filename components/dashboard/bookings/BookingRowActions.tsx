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
  UserPlus,
  CalendarClock,
  ThumbsUp,
  UserX,
  XCircle,
} from "lucide-react";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

type Props = {
  status: BookingStatus;
  bookingId: string;
};

const BookingRowActions = ({ status, bookingId }: Props) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
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

      {/* Confirm — only if pending */}
      {status === "pending" && (
        <DropdownMenuItem className="gap-2 text-brand-600 dark:text-brand-400 focus:text-brand-600 focus:bg-brand-500/8">
          <CheckCircle2 className="h-4 w-4" />
          Confirm booking
        </DropdownMenuItem>
      )}

      {/* Assign staff — pending or confirmed */}
      {(status === "pending" || status === "confirmed") && (
        <DropdownMenuItem className="gap-2">
          <UserPlus className="h-4 w-4" />
          Assign staff
        </DropdownMenuItem>
      )}

      {/* Reschedule — pending or confirmed */}
      {(status === "pending" || status === "confirmed") && (
        <DropdownMenuItem className="gap-2">
          <CalendarClock className="h-4 w-4" />
          Reschedule
        </DropdownMenuItem>
      )}

      {/* Mark complete — only if confirmed */}
      {status === "confirmed" && (
        <DropdownMenuItem className="gap-2">
          <ThumbsUp className="h-4 w-4" />
          Mark as complete
        </DropdownMenuItem>
      )}

      {/* Mark no-show — only if confirmed */}
      {status === "confirmed" && (
        <DropdownMenuItem className="gap-2">
          <UserX className="h-4 w-4" />
          Mark as no-show
        </DropdownMenuItem>
      )}

      {/* Cancel — pending or confirmed only */}
      {(status === "pending" || status === "confirmed") && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/8">
            <XCircle className="h-4 w-4" />
            Cancel booking
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default BookingRowActions;
