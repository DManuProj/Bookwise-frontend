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

const WAVE_DELAYS = ["0ms", "150ms", "300ms", "450ms", "600ms"];

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

  return (
    <div className="rounded-2xl border border-brand-500/20 dark:border-brand-500/10 bg-card p-6 relative">
      <style>{`
      @keyframes wave {
        from { height: 8px; }
        to   { height: 32px; }
      }
    `}</style>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute top-4 right-4"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>

      {/* ── IDLE ── */}
      {status === "idle" && (
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

          <div className="relative flex items-center justify-center mb-3">
            <button
              type="button"
              onClick={handleStartCall}
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
      )}

      {/* ── CONNECTING ── */}
      {status === "connecting" && (
        <div className="flex flex-col items-center py-12">
          <Loader2 className="h-12 w-12 text-brand-500 animate-spin mb-4" />
          <p className="text-sm font-medium text-foreground">Connecting...</p>
          <p className="text-xs text-muted-foreground mt-1">
            Allow microphone access if prompted
          </p>
        </div>
      )}

      {/* ── ACTIVE ── */}
      {(status === "listening" || status === "assistant-speaking") && (
        <>
          {/* ── Connecting gate: mic is live but Elliot hasn't spoken yet ── */}
          {!agentReady ? (
            <div className="flex flex-col items-center py-8">
              <div className="relative flex items-center justify-center mb-4">
                <span
                  className="absolute w-20 h-20 rounded-full bg-brand-500/20 animate-ping"
                  style={{ opacity: 0.6 }}
                />
                <div className="relative w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
                </div>
              </div>
              <p className="text-sm font-medium text-foreground text-center">
                Connecting to Elliot…
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1 mb-6">
                Please wait before speaking
              </p>
              <button
                type="button"
                onClick={handleEndCall}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="relative flex items-center justify-center mb-3">
                {status === "listening" && (
                  <>
                    <span
                      className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping"
                      style={{ opacity: 0.75 }}
                    />
                    <span
                      className="absolute inset-0 rounded-full bg-brand-500/20 animate-ping"
                      style={{ opacity: 0.5, animationDelay: "150ms" }}
                    />
                  </>
                )}
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="relative w-20 h-20 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center z-10"
                  aria-label="End call"
                >
                  <PhoneOff className="h-8 w-8" />
                </button>
              </div>

              <p className="text-sm font-medium text-brand-600 dark:text-brand-400 text-center">
                {status === "listening"
                  ? "Listening..."
                  : "Elliot is speaking..."}
              </p>

              {status === "assistant-speaking" && (
                <div className="flex items-center justify-center gap-1 mt-4 mb-2">
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
              )}

              <div className="max-h-48 overflow-y-auto space-y-2 mt-6 mb-2">
                {transcript.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center italic">
                    Conversation will appear here...
                  </p>
                ) : (
                  transcript.map((item, i) => (
                    <div
                      key={i}
                      className={
                        item.role === "assistant"
                          ? "rounded-xl bg-brand-500/10 p-3 text-sm text-brand-700 dark:text-brand-300"
                          : "rounded-xl bg-muted/40 p-3 text-sm text-foreground"
                      }
                    >
                      <span className="text-xs font-semibold opacity-70 block mb-0.5">
                        {item.role === "assistant" ? "Elliot" : "You"}
                      </span>
                      {item.text}
                    </div>
                  ))
                )}
                <div ref={transcriptEndRef} />
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Tap the button to end the call
              </p>
            </>
          )}
        </>
      )}

      {/* ── ENDED ── */}
      {status === "ended" && (
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mb-4">
            <Bot className="h-8 w-8 text-brand-500" />
          </div>
          <h3 className="text-lg font-bold text-foreground text-center mb-2">
            Call ended
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
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
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <MicOff className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-bold text-foreground text-center mb-2">
            Voice booking unavailable
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {errorMessage}
          </p>
          <Button
            onClick={onClose}
            className="rounded-xl bg-brand-500 hover:bg-brand-600 text-white"
          >
            Book manually instead
          </Button>
        </div>
      )}
    </div>
  );
}
