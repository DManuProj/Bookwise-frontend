"use client";

import { CalendarDays, Bot } from "lucide-react";

interface BookingChannelSelectorProps {
  onManual: () => void;
  onVoice: () => void;
  voiceAiEnabled: boolean;
  orgName: string;
}

export default function BookingChannelSelector({
  onManual,
  onVoice,
  voiceAiEnabled,
}: BookingChannelSelectorProps) {
  const manualCard = (
    <div
      role="button"
      tabIndex={0}
      onClick={onManual}
      onKeyDown={(e) => e.key === "Enter" && onManual()}
      className="cursor-pointer rounded-2xl border-2 border-border hover:border-brand-500 hover:bg-brand-500/5 transition-all duration-200 p-6 text-center group"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-brand-500/10 transition-colors flex items-center justify-center mx-auto mb-4">
        <CalendarDays className="h-7 w-7 text-muted-foreground group-hover:text-brand-500 transition-colors" />
      </div>
      <p className="text-base font-semibold text-foreground mb-2">Book Manually</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Choose your service, staff and time slot step by step.
      </p>
      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full mt-3 inline-block">
        4 simple steps
      </span>
    </div>
  );

  const voiceCard = (
    <div
      role="button"
      tabIndex={0}
      onClick={onVoice}
      onKeyDown={(e) => e.key === "Enter" && onVoice()}
      className="rounded-2xl border-2 border-brand-500/40 bg-brand-500/5 hover:border-brand-500 hover:bg-brand-500/[0.08] transition-all duration-200 p-6 text-center cursor-pointer group relative overflow-hidden"
    >
      <span className="absolute top-3 right-3 text-xs bg-brand-500 text-white px-2 py-0.5 rounded-full font-medium">
        RECOMMENDED
      </span>
      <div className="w-14 h-14 rounded-2xl bg-brand-500/15 group-hover:bg-brand-500/20 transition-colors flex items-center justify-center mx-auto mb-4">
        <Bot className="h-7 w-7 text-brand-500" />
      </div>
      <p className="text-base font-semibold text-foreground mb-2">Book with AI</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Talk to our AI assistant and get booked in seconds.
      </p>
      <span className="text-xs bg-brand-500/15 text-brand-600 dark:text-brand-400 px-2 py-1 rounded-full mt-3 inline-block">
        Available 24/7
      </span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-xl font-bold text-foreground text-center mb-2">
        How would you like to book?
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Choose your preferred booking method
      </p>

      {voiceAiEnabled ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {manualCard}
          {voiceCard}
        </div>
      ) : (
        <div className="max-w-sm mx-auto">{manualCard}</div>
      )}
    </div>
  );
}
