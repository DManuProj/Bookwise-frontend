"use client";

import { useState } from "react";
import { MapPin, Phone, ArrowLeft, Sparkles } from "lucide-react";
import { format, parse } from "date-fns";
import { PublicOrgResponse, BookingFormData } from "@/types";
import { CURRENCY } from "@/lib/countries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BookingProgress from "@/components/booking/BookingProgress";
import BookingChannelSelector from "@/components/booking/BookingChannelSelector";
import VoiceBookingWidget from "@/components/booking/VoiceBookingWidget";
import StepService from "@/components/booking/steps/StepService";
import StepStaff from "@/components/booking/steps/StepStaff";
import StepDateTime from "@/components/booking/steps/StepDateTime";
import StepDetails from "@/components/booking/steps/StepDetails";
import StepConfirmation from "@/components/booking/steps/StepConfirmation";
import { useCreatePublicBooking } from "@/hooks/api/usePublicBooking";
import { queryKeys } from "@/lib/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

interface BookingFlowProps {
  org: PublicOrgResponse;
}

export default function BookingFlow({ org }: BookingFlowProps) {
  const [showChannelSelector, setShowChannelSelector] = useState(true);
  const [voiceWidgetOpen, setVoiceWidgetOpen] = useState(false);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedSvc, setSelectedSvc] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customer, setCustomer] = useState<BookingFormData | null>(null);

  const service = org.services.find((s) => s.id === selectedSvc) ?? null;
  const staff = org.staff.find((s) => s.id === selectedStaff) ?? null;

  const { mutate: createBooking, isPending: isSubmitting } =
    useCreatePublicBooking();

  const queryClient = useQueryClient();

  const orgInitials = org.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSubmit(details: BookingFormData) {
    if (!selectedSvc || !selectedDate || !selectedTime) return;
    createBooking(
      {
        slug: org.slug,
        serviceId: selectedSvc,
        staffId: selectedStaff ?? undefined,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        note: details.note || undefined,
        customer: {
          name: details.name,
          email: details.email,
          phone: details.phone,
        },
      },
      {
        onSuccess: () => {
          setCustomer(details);
          setStep(5);
        },
        onError: (error: any) => {
          // Toast is shown by the hook. Here we only handle the recovery flow.
          // Brittle string match — if backend error messages change, the auto-jump
          // back to step 3 stops working but the toast still fires.
          const message = error?.response?.data?.message ?? "";
          const isStaleSlot =
            message.includes("no longer available") ||
            message.includes("on leave");

          if (isStaleSlot) {
            setSelectedTime("");
            queryClient.invalidateQueries({
              queryKey: queryKeys.publicSlots(
                org.slug,
                selectedSvc,
                selectedStaff,
                format(selectedDate, "yyyy-MM-dd"),
              ),
            });
            setStep(3);
          }
        },
      },
    );
  }

  /* ── Channel selector screen ── */
  if (showChannelSelector) {
    return (
      <BookingChannelSelector
        onManual={() => setShowChannelSelector(false)}
        onVoice={() => {
          setShowChannelSelector(false);
          setVoiceWidgetOpen(true);
        }}
        aiBookingAvailable={org.aiBookingAvailable}
        orgName={org.name}
      />
    );
  }

  /* ── Voice widget screen ── */
  if (voiceWidgetOpen) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <VoiceBookingWidget
          orgName={org.name}
          onClose={() => {
            setVoiceWidgetOpen(false);
            setShowChannelSelector(true);
          }}
          orgSlug={org.slug}
        />
      </div>
    );
  }

  /* ── Two-panel booking flow ── */
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button
        type="button"
        onClick={() => setShowChannelSelector(true)}
        className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to booking options
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        {/* ── Left panel ── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl card-surface p-6 shadow-sm">
            {/* subtle brand glow */}
            <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-brand-500/10 blur-3xl" />

            {/* Org identity */}
            <div className="relative mb-4 flex items-center gap-3">
              <Avatar className="h-14 w-14 shrink-0 rounded-2xl ring-2 ring-brand-500/15">
                {org.logo && (
                  <AvatarImage
                    src={org.logo}
                    alt={org.name}
                    className="rounded-2xl"
                  />
                )}
                <AvatarFallback className="rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-bold text-white">
                  {orgInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-base font-bold tracking-tight text-foreground">
                  {org.name}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                  </span>
                  Online Booking
                </span>
              </div>
            </div>

            {org.description && (
              <p className="relative mb-5 text-sm leading-relaxed text-muted-foreground">
                {org.description}
              </p>
            )}

            <div className="relative space-y-2.5">
              {org.address && (
                <div className="flex items-start gap-2.5">
                  <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {org.address}
                  </span>
                </div>
              )}
              {org.phone && (
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {org.phone}
                  </span>
                </div>
              )}
            </div>

            {/* Selection summary */}
            {step > 1 && service && (
              <div className="relative mt-5 rounded-2xl border border-brand-500/20 bg-brand-500/[0.06] p-4 dark:bg-brand-500/10">
                <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  <Sparkles className="h-3 w-3" />
                  Your Selection
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {service.name}
                  </p>
                  <p className="shrink-0 text-sm font-bold text-brand-600 dark:text-brand-400">
                    {CURRENCY}
                    {service.price}
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {service.durationMins} mins
                </p>
                {staff && step > 2 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    with {staff.firstName} {staff.lastName}
                  </p>
                )}
                {selectedDate && selectedTime && step > 3 && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {format(selectedDate, "EEE, MMM d")} at{" "}
                    {format(parse(selectedTime, "HH:mm", new Date()), "h:mm a")}
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* ── Right panel ── */}
        <div className="rounded-3xl card-surface p-6 shadow-sm lg:p-8">
          {step < 5 && <BookingProgress currentStep={step} />}

          {step === 1 && (
            <StepService
              services={org.services}
              selected={selectedSvc}
              onSelect={setSelectedSvc}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepStaff
              staff={org.staff}
              selected={selectedStaff}
              onSelect={setSelectedStaff}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <StepDateTime
              slug={org.slug}
              serviceId={selectedSvc!}
              staffId={selectedStaff}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <StepDetails
              onSubmit={handleSubmit}
              onBack={() => setStep(3)}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 5 && customer && service && selectedDate && (
            <StepConfirmation
              service={service}
              staff={staff}
              date={selectedDate}
              time={selectedTime}
              customer={customer}
              orgName={org.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
