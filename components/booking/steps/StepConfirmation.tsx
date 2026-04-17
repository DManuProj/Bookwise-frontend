import {
  CheckCircle2,
  CalendarDays,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { OrgService, OrgStaff, BookingFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface StepConfirmationProps {
  service: OrgService;
  staff: OrgStaff | null;
  date: Date;
  time: string;
  customer: BookingFormData;
  orgName: string;
  currency: string;
}

export default function StepConfirmation({
  service,
  staff,
  date,
  time,
  customer,
  orgName,
  currency,
}: StepConfirmationProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Success icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/15 mb-4">
        <CheckCircle2 className="h-8 w-8 text-brand-500" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        You&apos;re booked! 🎉
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Your appointment at{" "}
        <span className="font-semibold text-foreground">{orgName}</span> is
        confirmed. Check your email for details.
      </p>

      {/* Booking summary card */}
      <div className="w-full rounded-xl border border-brand-500/20 dark:border-brand-500/10 overflow-hidden mb-6 text-left">
        <div className="px-5 py-3 bg-brand-500/[0.08] dark:bg-brand-500/10 border-b border-brand-500/15">
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
            Booking Confirmation
          </p>
        </div>
        <div className="px-5 py-4 space-y-3">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
              <CalendarDays className="h-4 w-4 text-brand-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date &amp; Time</p>
              <p className="text-sm font-medium text-foreground">
                {format(date, "EEEE, MMMM d, yyyy")} at {time}
              </p>
            </div>
          </div>

          {/* Service */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
              <CheckCircle2 className="h-4 w-4 text-brand-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Service</p>
              <p className="text-sm font-medium text-foreground">
                {service.name} &middot; {service.duration} mins &middot;{" "}
                {currency}{service.price}
              </p>
            </div>
          </div>

          {/* Staff */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
              <User className="h-4 w-4 text-brand-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Staff</p>
              <p className="text-sm font-medium text-foreground">
                {staff ? staff.name : "First available"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
              <Mail className="h-4 w-4 text-brand-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confirmation sent to</p>
              <p className="text-sm font-medium text-foreground">
                {customer.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
              <Phone className="h-4 w-4 text-brand-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">
                {customer.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer note */}
      {customer.note && (
        <div className="w-full text-left p-4 rounded-xl bg-muted/40 border border-border mb-6">
          <p className="text-xs text-muted-foreground mb-1">Your note</p>
          <p className="text-sm text-foreground">{customer.note}</p>
        </div>
      )}

      <Separator className="mb-6 w-full" />

      <Button
        variant="outline"
        className="w-full rounded-xl h-11"
        onClick={() => window.location.reload()}
      >
        Book Another Appointment
      </Button>
    </div>
  );
}
