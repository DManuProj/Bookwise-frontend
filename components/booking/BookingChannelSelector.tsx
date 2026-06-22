"use client";

import {
  CalendarDays,
  Bot,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface BookingChannelSelectorProps {
  onManual: () => void;
  onVoice: () => void;
  aiBookingAvailable: boolean;
  orgName: string;
}

export default function BookingChannelSelector({
  onManual,
  onVoice,
  aiBookingAvailable,
  orgName,
}: BookingChannelSelectorProps) {
  /* ── Manual card ── */
  const manualCard = (
    <div
      role="button"
      tabIndex={0}
      onClick={onManual}
      onKeyDown={(e) => e.key === "Enter" && onManual()}
      className="group flex cursor-pointer flex-col rounded-3xl card-surface p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10"
    >
      <div className="mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-colors group-hover:bg-brand-500/10 group-hover:text-brand-600 dark:group-hover:text-brand-400">
        <CalendarDays className="h-6 w-6" />
      </div>
      <p className="mb-1.5 text-lg font-bold tracking-tight text-foreground">
        Book Manually
      </p>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
        Choose your service, staff and time slot, step by step.
      </p>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          4 simple steps
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all group-hover:bg-brand-500/10 group-hover:text-brand-600 dark:group-hover:text-brand-400">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );

  /* ── AI card */
  const voiceCard = (
    <div
      role="button"
      tabIndex={0}
      onClick={onVoice}
      onKeyDown={(e) => e.key === "Enter" && onVoice()}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-brand-500/5 to-transparent p-7 shadow-lg shadow-brand-500/15 transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/25 dark:from-brand-500/20"
    >
      {/* glow */}
      <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 rounded-full bg-brand-500/20 blur-3xl" />

      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
        <Sparkles className="h-3 w-3" />
        RECOMMENDED
      </span>

      <div className="relative mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
        <Bot className="h-6 w-6" />
      </div>
      <p className="relative mb-1.5 text-lg font-bold tracking-tight text-foreground">
        Book with AI
      </p>
      <p className="relative mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
        Talk to our AI assistant and get booked in seconds.
      </p>
      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
          <Clock className="h-3.5 w-3.5" />
          Available 24/7
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-brand-500/30">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );

  return (
    <section className="relative mx-auto max-w-5xl overflow-hidden px-4 py-20">
      {/* ambient glows */}
      <div className="pointer-events-none absolute left-[8%] top-0 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[6%] h-72 w-72 rounded-full bg-brand-500/[0.07] blur-3xl" />

      {/* heading */}
      <div className="relative mx-auto mb-11 max-w-xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
            Booking · 24/7
          </span>
        </div>
        <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-foreground text-balance md:text-4xl">
          How would you like to book?
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground text-pretty">
          Choose your preferred way to schedule an appointment at{" "}
          <span className="font-semibold text-foreground">{orgName}</span>.
        </p>
      </div>

      {/* cards */}
      {aiBookingAvailable ? (
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
          {manualCard}
          {voiceCard}
        </div>
      ) : (
        <div className="mx-auto max-w-sm">{manualCard}</div>
      )}

      {/* trust strip */}
      <div className="relative mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Instant confirmation · No account needed · Secure
      </div>
    </section>
  );
}
