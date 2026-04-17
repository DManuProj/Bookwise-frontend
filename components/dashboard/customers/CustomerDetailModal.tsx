"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import { BookingStatus, CustomerRow } from "@/types";

/* ── Status config ── */
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
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-0",
  },
  no_show: {
    label: "No Show",
    icon: XCircle,
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-0",
  },
  rescheduled: {
    label: "Rescheduled",
    icon: CircleDot,
    className: "bg-blue-500/10  text-blue-600  dark:text-blue-400  border-0",
  },
};

type Props = {
  open: boolean;
  onClose: () => void;
  customer: CustomerRow | null;
  onSaveNote: (id: string, note: string) => void;
};

const CustomerDetailModal = ({
  open,
  onClose,
  customer,
  onSaveNote,
}: Props) => {
  const [note, setNote] = useState(customer?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      // TODO: PUT /api/customers/:id/notes
      await new Promise((res) => setTimeout(res, 600));
      onSaveNote(customer.id, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 shrink-0 ring-2 ring-brand-500/15">
              <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-base font-bold">
                {initials}
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

        {/* Scrollable body */}
        <div
          className="overflow-y-auto px-6 py-5 space-y-6
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-brand-500/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-brand-500/40"
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
                value: customer.lastVisit,
                icon: Clock,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                label: "First Seen",
                value: customer.firstSeen,
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
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-brand-500" />
              <h3 className="text-sm font-semibold text-foreground">Notes</h3>
            </div>
            <Textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setSaved(false);
              }}
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
                disabled={saving}
                className={`h-8 text-xs rounded-lg transition-all ${
                  saved
                    ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20"
                    : "bg-brand-500 hover:bg-brand-600 text-white"
                }`}
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {saving ? "Saving..." : saved ? "Saved ✓" : "Save Note"}
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
                {customer.bookingHistory.length} bookings
              </Badge>
            </div>

            {customer.bookingHistory.length > 0 ? (
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
                    {customer.bookingHistory.map((booking) => {
                      const status = STATUS_CONFIG[booking.status];
                      const StatusIcon = status.icon;
                      return (
                        <TableRow
                          key={booking.id}
                          className="hover:bg-muted/30 border-b border-border last:border-0"
                        >
                          <TableCell className="px-4 py-3">
                            <p className="text-sm font-medium text-foreground">
                              {booking.service}
                            </p>
                          </TableCell>
                          <TableCell className="py-3">
                            <p className="text-sm font-medium text-foreground">
                              {booking.time}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.date}
                            </p>
                          </TableCell>
                          <TableCell className="py-3">
                            <p className="text-sm text-muted-foreground">
                              {booking.staff}
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

        {/* Footer */}
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
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailModal;
