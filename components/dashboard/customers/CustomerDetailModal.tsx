"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Mail,
  Phone,
  CalendarDays,
  Clock,
  CheckCircle2,
  CircleDot,
  XCircle,
  Save,
  FileText,
  TrendingUp,
} from "lucide-react";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import type { BookingStatus } from "@/types";
import { useCustomer, useUpdateCustomerNotes } from "@/hooks/api/useCustomers";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string; icon: React.ElementType }
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
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-0",
  },
  NO_SHOW: {
    label: "No Show",
    icon: XCircle,
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0",
  },
  RESCHEDULED: {
    label: "Rescheduled",
    icon: CircleDot,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0",
  },
};

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
};

const formatTime = (iso: string) => format(new Date(iso), "h:mm a");

type Props = {
  open: boolean;
  onClose: () => void;
  customerId: string | null;
};

const CustomerDetailModal = ({ open, onClose, customerId }: Props) => {
  const { data: customer, isPending } = useCustomer(customerId);
  const { mutate: updateNotes, isPending: isSaving } = useUpdateCustomerNotes();

  console.log("customer", customer);

  const [note, setNote] = useState("");

  // Sync note state when customer data arrives
  useEffect(() => {
    if (customer) setNote(customer.notes ?? "");
  }, [customer]);

  const handleSaveNote = () => {
    if (!customer) return;
    updateNotes({ id: customer.id, notes: note });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl w-full p-0 gap-0 overflow-hidden">
        {isPending || !customer ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 shrink-0 ring-2 ring-brand-500/15">
                  <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-base font-bold">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl font-bold text-foreground">
                    {customer.name}
                  </DialogTitle>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {customer.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {customer.phone}
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div
              className="overflow-y-auto px-6 py-5 space-y-6"
              style={{ maxHeight: "calc(90vh - 200px)" }}
            >
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Total Bookings",
                    value: customer.totalBookings,
                    icon: CalendarDays,
                    color: "text-brand-500",
                    bg: "bg-brand-500/10",
                  },
                  {
                    label: "Last Visit",
                    value: formatDate(customer.lastVisit),
                    icon: Clock,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                  {
                    label: "First Seen",
                    value: formatDate(customer.firstSeen),
                    icon: TrendingUp,
                    color: "text-violet-500",
                    bg: "bg-violet-500/10",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-muted/20"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}
                      >
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <p className="text-lg font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Notes */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-brand-500" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Notes
                  </h3>
                </div>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add private notes about this customer..."
                  className="resize-none h-24 text-sm"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    Notes are private — only visible to your team.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveNote}
                    disabled={isSaving || note === (customer.notes ?? "")}
                    className="h-8 text-xs rounded-lg bg-brand-500 hover:bg-brand-600 text-white"
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    {isSaving ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Booking history */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="h-4 w-4 text-brand-500" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Booking History
                  </h3>
                  <Badge className="ml-auto bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0 text-xs">
                    {customer.bookings.length} bookings
                  </Badge>
                </div>

                {customer.bookings.length > 0 ? (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border bg-muted/30">
                          <TableHead className="px-4 text-xs font-medium">
                            Service
                          </TableHead>
                          <TableHead className="text-xs font-medium">
                            Date & Time
                          </TableHead>
                          <TableHead className="text-xs font-medium">
                            Staff
                          </TableHead>
                          <TableHead className="text-xs font-medium">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customer.bookings.map((booking) => {
                          const status = STATUS_CONFIG[booking.status];
                          const StatusIcon = status.icon;
                          const staffName = booking.user
                            ? `${booking.user.firstName} ${booking.user.lastName}`
                            : "Unassigned";

                          return (
                            <TableRow
                              key={booking.id}
                              className="hover:bg-muted/30 border-b border-border last:border-0"
                            >
                              <TableCell className="px-4 py-3">
                                <p className="text-sm font-medium text-foreground">
                                  {booking.service?.name ?? "—"}
                                </p>
                              </TableCell>
                              <TableCell className="py-3">
                                <p className="text-sm font-medium text-foreground">
                                  {formatTime(booking.startAt)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(booking.startAt)}
                                </p>
                              </TableCell>
                              <TableCell className="py-3">
                                <p className="text-sm text-muted-foreground">
                                  {staffName}
                                </p>
                              </TableCell>
                              <TableCell className="py-3">
                                <Badge
                                  className={`text-xs flex items-center gap-1 w-fit ${status.className}`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No bookings yet
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;
