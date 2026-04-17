"use client";

import { useState, useEffect } from "react";
import { Mic, Scissors, CalendarDays, User, CheckCircle2 } from "lucide-react";

type LucideIcon = React.ComponentType<{ className?: string }>;

const keywords: { Icon: LucideIcon; text: string; className: string }[] = [
  {
    Icon: Scissors,
    text: "Haircut — 45 min",
    className:
      "bg-brand-500/15 text-brand-400 border border-brand-500/20",
  },
  {
    Icon: CalendarDays,
    text: "Saturday morning",
    className: "bg-slate-700/50 text-slate-300 border border-slate-600/30",
  },
  {
    Icon: User,
    text: "With James",
    className: "bg-slate-700/50 text-slate-300 border border-slate-600/30",
  },
  {
    Icon: CheckCircle2,
    text: "Booking confirmed",
    className: "bg-brand-500 text-white shadow-lg shadow-brand-500/30",
  },
];

const WAVE_BARS = 16;

// One step every 500 ms:
//   steps 1–4  → reveal card 1, 2, 3, 4 (0 – 2 s)
//   steps 5–8  → hold all four visible   (2 – 4 s)
//   step  9    → reset to 0              (4 s) → restart
const STEP_MS = 500;
const RESET_AT = 9;

export default function VoiceDemoCard() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      if (step <= 4) setVisibleCount(step);
      if (step >= RESET_AT) {
        step = 0;
        setVisibleCount(0);
      }
    }, STEP_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes ringExpand {
          0%   { transform: scale(0.85); opacity: 0.55; }
          100% { transform: scale(1.5);  opacity: 0;    }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(0.95); }
          50%       { transform: scale(1.05); }
        }
        @keyframes voiceWave {
          0%, 100% { height: 4px;  }
          50%       { height: 20px; }
        }
      `}</style>

      <div className="relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        {/* ── TOP ZONE ≈ 60% ── */}
        <div className="p-5 pb-4">

          {/* Header bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
                <Mic className="h-4 w-4 text-brand-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  AI Booking Assistant
                </p>
                <p className="text-slate-500 text-xs">Bookwise Voice Agent</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-400 text-xs font-medium">
                Active
              </span>
            </div>
          </div>

          {/* Central orb with concentric rings */}
          <div className="relative flex items-center justify-center py-8">
            {/* Rings */}
            {(
              [
                { size: "w-32 h-32", delay: "0ms" },
                { size: "w-40 h-40", delay: "400ms" },
                { size: "w-48 h-48", delay: "800ms" },
              ] as const
            ).map(({ size, delay }) => (
              <div
                key={delay}
                className={`absolute ${size} rounded-full border border-brand-500/20`}
                style={{
                  animation: "ringExpand 2s ease-out infinite",
                  animationDelay: delay,
                }}
              />
            ))}

            {/* Orb */}
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                /* brand-500 = #10b981 */
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)",
                animation: "orbPulse 2s ease-in-out infinite",
              }}
            >
              <div className="w-14 h-14 rounded-full bg-brand-500/30 flex items-center justify-center border border-brand-500/40">
                <Mic className="h-6 w-6 text-brand-400" />
              </div>
            </div>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-0.5 mb-2">
            {Array.from({ length: WAVE_BARS }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-brand-500/70"
                style={{
                  height: "4px",
                  animation: "voiceWave 1.2s ease-in-out infinite",
                  animationDelay: `${i * 75}ms`,
                }}
              />
            ))}
          </div>

          <p className="text-xs text-brand-400 animate-pulse text-center">
            Listening to your request...
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mx-4" />

        {/* ── BOTTOM ZONE ≈ 40% ── */}
        <div className="p-4 pt-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
            Understood
          </p>

          <div className="relative overflow-hidden flex flex-col gap-2">
            {keywords.map(({ Icon, text, className }, i) => (
              <div
                key={i}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-500 ${className} ${
                  i < visibleCount
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
