import {
  CheckCircle2,
  CalendarDays,
  User,
  Mail,
  Phone,
  Check,
} from "lucide-react";
import { format, parse } from "date-fns";
import { Service, PublicOrgStaff, BookingFormData } from "@/types";
import { CURRENCY } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface StepConfirmationProps {
  service: Service;
  staff: PublicOrgStaff | null;
  date: Date;
  time: string;
  customer: BookingFormData;
  orgName: string;
}

export default function StepConfirmation({
  service,
  staff,
  date,
  time,
  customer,
  orgName,
}: StepConfirmationProps) {
  const rows = [
    {
      icon: CalendarDays,
      label: "Date & Time",
      value: `${format(date, "EEEE, MMMM d, yyyy")} at ${format(
        parse(time, "HH:mm", new Date()),
        "h:mm a",
      )}`,
    },
    {
      icon: Check,
      label: "Service",
      value: `${service.name} · ${service.durationMins} mins · ${CURRENCY}${service.price}`,
    },
    {
      icon: User,
      label: "Staff",
      value: staff ? `${staff.firstName} ${staff.lastName}` : "First available",
    },
    {
      icon: Mail,
      label: "Confirmation sent to",
      value: customer.email,
    },
    {
      icon: Phone,
      label: "Phone",
      value: customer.phone,
    },
  ];

  return (
    <div className="flex flex-col items-center text-center">
      {/* Success icon */}
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/20 opacity-60" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
          <CheckCircle2 className="h-8 w-8" />
        </div>
      </div>

      <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground">
        You&apos;re booked!
      </h2>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
        Your appointment at{" "}
        <span className="font-semibold text-foreground">{orgName}</span> is
        confirmed. Check your email for details.
      </p>

      {/* Booking summary card */}
      <div className="mb-6 w-full overflow-hidden rounded-2xl border border-brand-500/20 text-left dark:border-brand-500/10">
        <div className="border-b border-brand-500/15 bg-brand-500/[0.08] px-5 py-3 dark:bg-brand-500/10">
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
            Booking Confirmation
          </p>
        </div>
        <div className="space-y-3.5 bg-card px-5 py-4">
          {rows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer note */}
      {customer.note && (
        <div className="mb-6 w-full rounded-2xl border border-border bg-muted/40 p-4 text-left">
          <p className="mb-1 text-xs text-muted-foreground">Your note</p>
          <p className="text-sm text-foreground">{customer.note}</p>
        </div>
      )}

      <Separator className="mb-6 w-full" />

      <Button
        variant="outline"
        className="h-12 w-full rounded-xl"
        onClick={() => window.location.reload()}
      >
        Book Another Appointment
      </Button>
    </div>
  );
}
