"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  CircleDot,
  XCircle,
  Bot,
  MousePointer,
  Phone,
} from "lucide-react";
import BookingRowActions from "@/components/dashboard/bookings/BookingRowActions";
import { Booking, BookingSource, BookingStatus } from "@/types";
import { isToday, isTomorrow, isYesterday, format } from "date-fns";

/* ── Config ── */
const STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: CircleDot,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-0",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10   text-red-600   dark:text-red-400   border-0",
  },
  NO_SHOW: {
    label: "No Show",
    icon: XCircle,
    className: "bg-rose-500/10  text-rose-600  dark:text-rose-400  border-0",
  },
};

const SOURCE_CONFIG: Record<
  BookingSource,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  MANUAL_CUSTOMER: {
    label: "Online",
    icon: MousePointer,
    className: "text-blue-500",
  },
  VOICE_AI: { label: "Voice AI", icon: Bot, className: "text-violet-500" },
  MANUAL_DASHBOARD: {
    label: "Manual",
    icon: Phone,
    className: "text-slate-500",
  },
};

const BookingsTable = ({ bookings }: { bookings: Booking[] }) => {
  if (bookings.length === 0) return null;

  /* ── Date/time formatters ── */
  const formatBookingDate = (iso: string) => {
    const date = new Date(iso);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEE, MMM d");
  };

  const formatBookingTime = (iso: string) => format(new Date(iso), "h:mm a");

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[280px] pl-6  font-medium ">
              Customer
            </TableHead>
            <TableHead className=" font-medium">Service</TableHead>
            <TableHead className=" font-medium">Date & Time</TableHead>
            <TableHead className=" font-medium">Staff</TableHead>
            <TableHead className=" font-medium">Source</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className=" font-medium w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const status = STATUS_CONFIG[booking.status];
            const source = SOURCE_CONFIG[booking.source];
            const StatusIcon = status.icon;
            const SourceIcon = source.icon;

            const staffName = booking.user
              ? `${booking.user.firstName} ${booking.user.lastName}`
              : null;

            // Past + still-unresolved = needs visual flag
            const isPast = new Date(booking.endAt) < new Date();
            const isUnresolved =
              booking.status === "PENDING" || booking.status === "CONFIRMED";
            const isStale = isPast && isUnresolved;

            return (
              <TableRow
                key={booking.id}
                className={`hover:bg-muted/40 transition-colors border-b border-border last:border-0 ${
                  isStale ? "bg-muted/20" : ""
                }`}
              >
                {/* Customer */}
                <TableCell
                  className={`px-6 py-3 ${isStale ? "opacity-60" : ""}`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {booking.customer?.name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.customer?.phone ?? "—"}
                  </p>
                </TableCell>

                {/* Service */}
                <TableCell className={`py-3 ${isStale ? "opacity-60" : ""}`}>
                  <p className="text-sm text-foreground">
                    {booking.service?.name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.service?.durationMins ?? 0}min
                  </p>
                </TableCell>

                {/* Date & Time */}
                <TableCell className={`py-3 ${isStale ? "opacity-60" : ""}`}>
                  <p className="text-sm font-medium text-foreground">
                    {formatBookingTime(booking.startAt)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBookingDate(booking.startAt)}
                  </p>
                </TableCell>

                {/* Staff */}
                <TableCell className={`py-3 ${isStale ? "opacity-60" : ""}`}>
                  {staffName ? (
                    <p className="text-sm text-foreground">{staffName}</p>
                  ) : (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      Unassigned
                    </span>
                  )}
                </TableCell>

                {/* Source */}
                <TableCell className={`py-3 ${isStale ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-1.5">
                    <SourceIcon className={`h-4 w-4 ${source.className}`} />
                    <span className="text-sm text-muted-foreground">
                      {source.label}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={`text-xs flex items-center gap-1 w-fit ${status.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                    {isStale && (
                      <Badge className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 border-0 w-fit">
                        Past
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3 pr-4">
                  <BookingRowActions booking={booking} isPast={isPast} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingsTable;
