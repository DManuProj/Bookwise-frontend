"use client";

import { useState } from "react";
import { Bot, Mic, MicOff, X, Scissors, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceBookingWidgetProps {
  orgName: string;
  onClose: () => void;
}

const WAVE_DELAYS = ["0ms", "150ms", "300ms", "450ms", "600ms"];

export default function VoiceBookingWidget({
  orgName,
  onClose,
}: VoiceBookingWidgetProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="rounded-2xl border border-brand-500/20 dark:border-brand-500/10 bg-card p-6 relative">
      {/* Wave keyframe */}
      <style>{`
        @keyframes wave {
          from { height: 8px; }
          to   { height: 32px; }
        }
      `}</style>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>

      {!isActive ? (
        /* ── Idle state ── */
        <>
          <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-brand-500" />
          </div>

          <h2 className="text-xl font-bold text-foreground text-center">
            AI Booking Assistant
          </h2>
          <p className="text-sm text-muted-foreground text-center leading-relaxed mt-2 mb-6">
            Hi! I can help you book an appointment at{" "}
            <span className="font-medium text-foreground">{orgName}</span>. Just
            tap the button and tell me what you need.
          </p>

          {/* Capability hints */}
          <div className="flex flex-col gap-2 mb-8">
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/40 text-sm text-muted-foreground">
              <Scissors className="h-4 w-4 text-brand-500 shrink-0" />
              Book any service
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/40 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-brand-500 shrink-0" />
              Check real-time availability
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/40 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-brand-500 shrink-0" />
              Available 24/7
            </div>
          </div>

          {/* Mic button */}
          <div className="relative flex items-center justify-center mb-3">
            <button
              type="button"
              onClick={() => {
                setIsActive(true);
                // TODO: initialize Vapi session here, pass org context
              }}
              className="w-20 h-20 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:scale-105 transition-all duration-200 flex items-center justify-center"
              aria-label="Start voice booking"
            >
              <Mic className="h-8 w-8" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Tap to start talking
          </p>
        </>
      ) : (
        /* ── Active state ── */
        <>
          {/* Pulsing mic button */}
          <div className="relative flex items-center justify-center mb-3">
            <span
              className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping"
              style={{ opacity: 0.75 }}
            />
            <span
              className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping"
              style={{ opacity: 0.5, animationDelay: "150ms" }}
            />
            <button
              type="button"
              onClick={() => {
                setIsActive(false);
                // TODO: end Vapi session here
              }}
              className="relative w-20 h-20 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center z-10"
              aria-label="Stop voice booking"
            >
              <MicOff className="h-8 w-8" />
            </button>
          </div>

          <p className="text-sm font-medium text-brand-600 dark:text-brand-400 text-center animate-pulse">
            Listening...
          </p>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-1 mt-4 mb-6">
            {WAVE_DELAYS.map((delay, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-brand-500"
                style={{
                  animationName: "wave",
                  animationDuration: "1s",
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                  animationDirection: "alternate",
                  animationDelay: delay,
                  height: "8px",
                }}
              />
            ))}
          </div>

          {/* Transcript area */}
          <div className="max-h-40 overflow-y-auto space-y-3">
            <div className="rounded-xl bg-brand-500/10 p-3 text-sm text-brand-600 dark:text-brand-400">
              Hello! I&apos;m the Bookwise AI assistant for{" "}
              <span className="font-medium">{orgName}</span>. How can I help you
              today? I can book services, check availability and answer any
              questions.
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Voice AI powered by Bookwise &middot; This conversation may be
            recorded for quality purposes
          </p>
        </>
      )}
    </div>
  );
}
