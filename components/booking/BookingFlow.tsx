"use client";

import { useState } from "react";
import { MapPin, Phone, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { OrgData, BookingFormData } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BookingProgress from "@/components/booking/BookingProgress";
import BookingChannelSelector from "@/components/booking/BookingChannelSelector";
import VoiceBookingWidget from "@/components/booking/VoiceBookingWidget";
import StepService from "@/components/booking/steps/StepService";
import StepStaff from "@/components/booking/steps/StepStaff";
import StepDateTime from "@/components/booking/steps/StepDateTime";
import StepDetails from "@/components/booking/steps/StepDetails";
import StepConfirmation from "@/components/booking/steps/StepConfirmation";

interface BookingFlowProps {
  org: OrgData;
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = org.services.find((s) => s.id === selectedSvc) ?? null;
  const staff = org.staff.find((s) => s.id === selectedStaff) ?? null;

  const orgInitials = org.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSubmit(details: BookingFormData) {
    setIsSubmitting(true);
    try {
      // TODO: POST /api/public/bookings
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCustomer(details);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
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
        voiceAiEnabled={org.voiceAiEnabled}
        orgName={org.name}
      />
    );
  }

  /* ── Voice widget screen ── */
  if (voiceWidgetOpen) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <VoiceBookingWidget
          orgName={org.name}
          onClose={() => {
            setVoiceWidgetOpen(false);
            setShowChannelSelector(true);
          }}
        />
      </div>
    );
  }

  /* ── Two-panel booking flow ── */
  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => setShowChannelSelector(true)}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to booking options
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* ── Left panel ── */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-brand-500/20 dark:border-brand-500/10 bg-card p-6">
              {/* Org identity */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-14 w-14 rounded-2xl ring-2 ring-brand-500/15 shrink-0">
                  {org.logo && (
                    <AvatarImage src={org.logo} alt={org.name} className="rounded-2xl" />
                  )}
                  <AvatarFallback className="rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 text-lg font-bold">
                    {orgInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-base font-bold text-foreground truncate">
                    {org.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Online Booking</p>
                </div>
              </div>

              {org.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {org.description}
                </p>
              )}

              <div className="space-y-2">
                {org.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">
                      {org.address}
                    </span>
                  </div>
                )}
                {org.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-500 shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      {org.phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Selection summary */}
              {step > 1 && service && (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Your Selection
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {service.name}
                    </p>
                    <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 shrink-0">
                      {org.currency}{service.price}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {service.duration} mins
                  </p>
                  {staff && step > 2 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      with {staff.name}
                    </p>
                  )}
                  {selectedDate && selectedTime && step > 3 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(selectedDate, "EEE, MMM d")} at {selectedTime}
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* ── Right panel ── */}
          <div className="rounded-2xl border border-brand-500/20 dark:border-brand-500/10 bg-card p-6 lg:p-8">
            {step < 5 && <BookingProgress currentStep={step} />}

            {step === 1 && (
              <StepService
                services={org.services}
                selected={selectedSvc}
                onSelect={setSelectedSvc}
                onNext={() => setStep(2)}
                currency={org.currency}
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
                currency={org.currency}
              />
            )}
          </div>
        </div>
      </div>

    </>
  );
}
