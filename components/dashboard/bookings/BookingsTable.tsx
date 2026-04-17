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

/* ── Types ── */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";
export type BookingSource = "manual_customer" | "voice_ai" | "manual_dashboard";

export type Booking = {
  id: string;
  customer: { name: string; phone: string };
  service: { name: string; duration: number };
  date: string;
  time: string;
  staff: string | null;
  source: BookingSource;
  status: BookingStatus;
};

/* ── Config ── */
const STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Pending",
    icon: CircleDot,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-0",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10   text-red-600   dark:text-red-400   border-0",
  },
  no_show: {
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
  manual_customer: {
    label: "Online",
    icon: MousePointer,
    className: "text-blue-500",
  },
  voice_ai: { label: "Voice AI", icon: Bot, className: "text-violet-500" },
  manual_dashboard: {
    label: "Manual",
    icon: Phone,
    className: "text-slate-500",
  },
};

/* ── Placeholder data ── */
export const BOOKINGS: Booking[] = [
  {
    id: "bk001",
    customer: { name: "Sarah Johnson", phone: "+1 555 0101" },
    service: { name: "Haircut", duration: 45 },
    date: "Today",
    time: "9:00 AM",
    staff: "James",
    source: "manual_customer",
    status: "confirmed",
  },
  {
    id: "bk002",
    customer: { name: "Mike Chen", phone: "+1 555 0102" },
    service: { name: "Deep Tissue Massage", duration: 60 },
    date: "Today",
    time: "10:30 AM",
    staff: null,
    source: "voice_ai",
    status: "pending",
  },
  {
    id: "bk003",
    customer: { name: "Emma Williams", phone: "+1 555 0103" },
    service: { name: "Manicure", duration: 30 },
    date: "Today",
    time: "11:00 AM",
    staff: "Anna",
    source: "manual_customer",
    status: "confirmed",
  },
  {
    id: "bk004",
    customer: { name: "David Brown", phone: "+1 555 0104" },
    service: { name: "Haircut", duration: 45 },
    date: "Today",
    time: "2:00 PM",
    staff: "You",
    source: "manual_dashboard",
    status: "pending",
  },
  {
    id: "bk005",
    customer: { name: "Lisa Anderson", phone: "+1 555 0105" },
    service: { name: "Swedish Massage", duration: 60 },
    date: "Today",
    time: "3:30 PM",
    staff: "Anna",
    source: "voice_ai",
    status: "confirmed",
  },
  {
    id: "bk006",
    customer: { name: "Tom Harris", phone: "+1 555 0106" },
    service: { name: "Beard Trim", duration: 20 },
    date: "Tomorrow",
    time: "9:00 AM",
    staff: "James",
    source: "manual_customer",
    status: "confirmed",
  },
  {
    id: "bk007",
    customer: { name: "Rachel Green", phone: "+1 555 0107" },
    service: { name: "Facial", duration: 60 },
    date: "Tomorrow",
    time: "11:30 AM",
    staff: null,
    source: "voice_ai",
    status: "pending",
  },
  {
    id: "bk008",
    customer: { name: "James Miller", phone: "+1 555 0108" },
    service: { name: "Haircut", duration: 45 },
    date: "Yesterday",
    time: "2:00 PM",
    staff: "James",
    source: "manual_customer",
    status: "completed",
  },
  {
    id: "bk009",
    customer: { name: "Olivia Wilson", phone: "+1 555 0109" },
    service: { name: "Deep Tissue Massage", duration: 60 },
    date: "Yesterday",
    time: "4:00 PM",
    staff: "Anna",
    source: "voice_ai",
    status: "no_show",
  },
  {
    id: "bk010",
    customer: { name: "Chris Taylor", phone: "+1 555 0110" },
    service: { name: "Manicure", duration: 30 },
    date: "Mon 24",
    time: "10:00 AM",
    staff: "You",
    source: "manual_dashboard",
    status: "cancelled",
  },
];

/* ── Component ── */
type Props = {
  bookings: Booking[];
};

const BookingsTable = ({ bookings }: Props) => {
  if (bookings.length === 0) return null;

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

            return (
              <TableRow
                key={booking.id}
                className="hover:bg-muted/40 transition-colors border-b border-border last:border-0"
              >
                {/* Customer */}
                <TableCell className="px-6 py-3">
                  <p className="text-sm font-medium text-foreground">
                    {booking.customer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.customer.phone}
                  </p>
                </TableCell>

                {/* Service */}
                <TableCell className="py-3">
                  <p className="text-sm text-foreground">
                    {booking.service.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.service.duration}min
                  </p>
                </TableCell>

                {/* Date & Time */}
                <TableCell className="py-3">
                  <p className="text-sm font-medium text-foreground">
                    {booking.time}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.date}
                  </p>
                </TableCell>

                {/* Staff */}
                <TableCell className="py-3">
                  {booking.staff ? (
                    <p className="text-sm text-foreground">{booking.staff}</p>
                  ) : (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      Unassigned
                    </span>
                  )}
                </TableCell>

                {/* Source */}
                <TableCell className="py-3">
                  <div className="flex items-center gap-1.5">
                    <SourceIcon className={`h-4 w-4 ${source.className}`} />
                    <span className="text-sm text-muted-foreground">
                      {source.label}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-3">
                  <Badge
                    className={`text-xs flex items-center gap-1 w-fit ${status.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3 pr-4">
                  <BookingRowActions
                    status={booking.status}
                    bookingId={booking.id}
                  />
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
