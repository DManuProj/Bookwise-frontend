"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Mic,
  MicOff,
  X,
  Scissors,
  CalendarDays,
  Clock,
  Loader2,
  PhoneOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVapi } from "@/lib/vapi";

interface VoiceBookingWidgetProps {
  orgName: string;
  orgSlug: string;
  onClose: () => void;
}

const WAVE_DELAYS = [
  "0ms",
  "120ms",
  "240ms",
  "360ms",
  "480ms",
  "360ms",
  "240ms",
];

type CallStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "assistant-speaking"
  | "ended"
  | "error";

type TranscriptItem = {
  role: "user" | "assistant";
  text: string;
};

// ── Errors we should silently ignore (normal call-end lifecycle events)
const IGNORED_ERROR_PATTERNS = [
  "meeting has ended",
  "meeting ended due to ejection",
  "ejection",
  "call ended",
  "ended",
  "daily-error",
];

// Deeply extract any human-readable message from an unknown error shape.
// Vapi/Daily errors nest the message in different places.
const extractErrorText = (err: any): string => {
  if (!err) return "";
  if (typeof err === "string") return err.toLowerCase();
  const candidates = [
    err.message,
    err.errorMsg,
    err.msg,
    err.error?.message,
    err.error?.msg,
    typeof err.error === "string" ? err.error : undefined,
    err.reason,
    err.type,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c.toLowerCase();
  }
  try {
    return JSON.stringify(err).toLowerCase();
  } catch {
    return "";
  }
};

const isIgnorableError = (err: any): boolean => {
  if (!err) return true;
  if (typeof err === "object" && !Array.isArray(err)) {
    if (Object.keys(err).length === 0) {
      const text = extractErrorText(err);
      if (!text || text === "{}") return true;
      return IGNORED_ERROR_PATTERNS.some((p) => text.includes(p));
    }
  }
  const text = extractErrorText(err);
  return IGNORED_ERROR_PATTERNS.some((p) => text.includes(p));
};

export default function VoiceBookingWidget({
  orgName,
  orgSlug,
  onClose,
}: VoiceBookingWidgetProps) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [agentReady, setAgentReady] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const callEndedRef = useRef(false);
  // Set the instant teardown begins (manual end, AI end-call, or close), so the
  // error handler can suppress the ejection/teardown error that fires
  // immediately — before the 6s safety timer or call-end event arrives.
  const endingRef = useRef(false);

  useEffect(() => {
    const vapi = getVapi();

    const markEnded = () => {
      if (callEndedRef.current) return;
      callEndedRef.current = true;
      setStatus("ended");
    };

    const handleCallStart = () => {
      callEndedRef.current = false;
      endingRef.current = false;
      setAgentReady(false);
      setStatus("listening");
      setTranscript([]);
    };

    const handleCallEnd = () => {
      markEnded();
    };

    const handleSpeechStart = () => {
      if (callEndedRef.current) return;
      setAgentReady(true);
      setStatus("assistant-speaking");
    };

    const handleSpeechEnd = () => {
      if (callEndedRef.current) return;
      setStatus("listening");
    };

    const handleMessage = (msg: any) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          { role: msg.role, text: msg.transcript },
        ]);
      }

      // Detect Vapi's built-in end-call tool. We do NOT stop immediately
      // (that cuts off the goodbye). Let the server play the goodbye and fire
      // `call-end`. Safety net: if call-end doesn't arrive in 6s, force stop.
      const isEndCallTool =
        msg.type === "tool-calls" &&
        Array.isArray(msg.toolCallList) &&
        msg.toolCallList.some(
          (t: any) =>
            t?.function?.name === "end_call_tool" ||
            t?.name === "end_call_tool" ||
            t?.function?.name === "endCall",
        );

      if (isEndCallTool) {
        // Teardown is beginning — suppress any teardown errors from here on.
        endingRef.current = true;
        setTimeout(() => {
          if (!callEndedRef.current) {
            try {
              vapi.stop();
            } catch {
              /* no-op */
            }
            markEnded();
          }
        }, 6000);
      }
    };

    const handleError = (err: any) => {
      // 1. If the call has ended OR teardown has begun, ANY error that
      //    follows is just transport teardown noise — suppress it completely.
      if (callEndedRef.current || endingRef.current) {
        return;
      }

      // 2. Known-benign lifecycle errors (empty objects, ejection,
      //    meeting-ended) → treat as a normal end, never an error state.
      if (isIgnorableError(err)) {
        markEnded();
        return;
      }

      // 3. A genuine error during an active call → show error state.
      console.error("Vapi error:", err);
      callEndedRef.current = true;
      setStatus("error");
      setErrorMessage(
        extractErrorText(err) ||
          "Something went wrong. Please try manual booking.",
      );
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);

    return () => {
      if (!callEndedRef.current) {
        try {
          vapi.stop();
        } catch {
          /* no-op */
        }
      }
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
    };
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const handleStartCall = async () => {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    if (!assistantId) {
      setStatus("error");
      setErrorMessage(
        "Voice booking is not configured. Please try manual booking.",
      );
      return;
    }

    try {
      callEndedRef.current = false;
      endingRef.current = false;
      setStatus("connecting");
      const vapi = getVapi();

      const now = new Date();
      const dateContext = {
        slug: orgSlug,
        now: now.toISOString().split("T")[0],
        day_of_week: now.toLocaleDateString("en-US", { weekday: "long" }),
      };
      console.log("Vapi call starting with:", dateContext);
      await vapi.start(assistantId, {
        variableValues: dateContext,
      });
    } catch (err) {
      console.error("Failed to start Vapi call:", err);
      setStatus("error");
      setErrorMessage("Could not start voice call. Please try manual booking.");
    }
  };

  const handleEndCall = () => {
    endingRef.current = true;
    const vapi = getVapi();
    try {
      vapi.stop();
    } catch {
      /* no-op */
    }
    callEndedRef.current = true;
    setStatus("ended");
  };

  const handleReset = () => {
    callEndedRef.current = false;
    endingRef.current = false;
    setAgentReady(false);
    setStatus("idle");
    setTranscript([]);
    setErrorMessage("");
  };

  const handleClose = () => {
    if (
      status === "listening" ||
      status === "assistant-speaking" ||
      status === "connecting"
    ) {
      endingRef.current = true;
      const vapi = getVapi();
      try {
        vapi.stop();
      } catch {
        /* no-op */
      }
    }
    onClose();
  };

  const features = [
    { icon: Scissors, label: "Book any service" },
    { icon: CalendarDays, label: "Check real-time availability" },
    { icon: Clock, label: "Available 24/7" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-card p-6 shadow-xl shadow-brand-500/10 dark:border-brand-500/10">
      <style>{`
        @keyframes wave {
          from { height: 6px; }
          to   { height: 30px; }
        }
      `}</style>

      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-brand-500/15 blur-3xl" />

      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute right-3 top-3 z-10 rounded-full text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* ── IDLE ── */}
      {status === "idle" && (
        <div className="relative">
          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
            <Bot className="h-8 w-8" />
          </div>

          <h2 className="text-center text-xl font-bold tracking-tight text-foreground">
            AI Booking Assistant
          </h2>
          <p className="mx-auto mb-6 mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground text-pretty">
            Hi! I can help you book an appointment at{" "}
            <span className="font-semibold text-foreground">{orgName}</span>.
            Just tap the button and tell me what you need.
          </p>

          <div className="mb-8 flex flex-col gap-2">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-3.5 py-2.5 text-sm text-muted-foreground"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </div>
            ))}
          </div>

          <div className="relative mb-3 flex items-center justify-center">
            <span className="absolute h-20 w-20 rounded-full bg-brand-500/15" />
            <button
              type="button"
              onClick={handleStartCall}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/40 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-brand-500/50"
              aria-label="Start voice booking"
            >
              <Mic className="h-8 w-8" />
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Tap to start talking
          </p>
        </div>
      )}

      {/* ── CONNECTING ── */}
      {status === "connecting" && (
        <div className="flex flex-col items-center py-12">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
          <p className="text-sm font-semibold text-foreground">Connecting…</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Allow microphone access if prompted
          </p>
        </div>
      )}

      {/* ── ACTIVE ── */}
      {(status === "listening" || status === "assistant-speaking") && (
        <div className="relative">
          {/* ── Connecting gate: mic is live but Elliot hasn't spoken yet ── */}
          {!agentReady ? (
            <div className="flex flex-col items-center py-8">
              <div className="relative mb-4 flex items-center justify-center">
                <span className="absolute h-20 w-20 animate-ping rounded-full bg-brand-500/20 opacity-60" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                </div>
              </div>
              <p className="text-center text-sm font-semibold text-foreground">
                Connecting to Elliot…
              </p>
              <p className="mb-6 mt-1 text-center text-xs text-muted-foreground">
                Please wait before speaking
              </p>
              <button
                type="button"
                onClick={handleEndCall}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="relative mb-4 flex items-center justify-center">
                {status === "listening" && (
                  <>
                    <span className="absolute inset-0 m-auto h-20 w-20 animate-ping rounded-full bg-brand-500/20 opacity-75" />
                    <span
                      className="absolute inset-0 m-auto h-20 w-20 animate-ping rounded-full bg-brand-500/20 opacity-50"
                      style={{ animationDelay: "150ms" }}
                    />
                  </>
                )}
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-destructive text-white shadow-lg shadow-destructive/30 transition-transform hover:scale-105"
                  aria-label="End call"
                >
                  <PhoneOff className="h-7 w-7" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                <p className="text-center text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {status === "listening"
                    ? "Listening…"
                    : "Elliot is speaking…"}
                </p>
              </div>

              {/* Wave — always reserves height, animates only while speaking */}
              <div className="mb-2 mt-4 flex h-8 items-center justify-center gap-1">
                {WAVE_DELAYS.map((delay, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-brand-500"
                    style={
                      status === "assistant-speaking"
                        ? {
                            animationName: "wave",
                            animationDuration: "0.9s",
                            animationIterationCount: "infinite",
                            animationTimingFunction: "ease-in-out",
                            animationDirection: "alternate",
                            animationDelay: delay,
                            height: "6px",
                          }
                        : { height: "6px", opacity: 0.4 }
                    }
                  />
                ))}
              </div>

              <div className="mb-2 mt-4 max-h-48 space-y-2 overflow-y-auto pr-1">
                {transcript.length === 0 ? (
                  <p className="text-center text-xs italic text-muted-foreground">
                    Conversation will appear here…
                  </p>
                ) : (
                  transcript.map((item, i) => (
                    <div
                      key={i}
                      className={
                        item.role === "assistant"
                          ? "rounded-2xl rounded-tl-sm border border-brand-500/20 bg-brand-500/10 p-3 text-sm text-foreground"
                          : "ml-6 rounded-2xl rounded-tr-sm bg-muted p-3 text-sm text-foreground"
                      }
                    >
                      <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-brand-600 opacity-80 dark:text-brand-400">
                        {item.role === "assistant" ? "Elliot" : "You"}
                      </span>
                      {item.text}
                    </div>
                  ))
                )}
                <div ref={transcriptEndRef} />
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Tap the button to end the call
              </p>
            </>
          )}
        </div>
      )}

      {/* ── ENDED ── */}
      {status === "ended" && (
        <div className="flex flex-col items-center py-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
            <Bot className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-center text-lg font-bold tracking-tight text-foreground">
            Call ended
          </h3>
          <p className="mb-6 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
            Thanks for using voice booking. Check your email for confirmation if
            you booked an appointment.
          </p>
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-xl"
          >
            Start a new call
          </Button>
        </div>
      )}

      {/* ── ERROR ── */}
      {status === "error" && (
        <div className="flex flex-col items-center py-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <MicOff className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-center text-lg font-bold tracking-tight text-foreground">
            Voice booking unavailable
          </h3>
          <p className="mb-6 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
            {errorMessage}
          </p>
          <Button
            onClick={onClose}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-brand-600"
          >
            Book manually instead
          </Button>
        </div>
      )}
    </div>
  );
}
