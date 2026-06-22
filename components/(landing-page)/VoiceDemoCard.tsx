"use client";

import { useState, useEffect } from "react";
import { Mic } from "lucide-react";

const messages = [
  { role: "user", text: "I'd like a haircut Saturday morning" },
  {
    role: "ai",
    text: "We have 9:00, 10:30 and 11:00 with James. Which works best?",
  },
  { role: "user", text: "10:30 please" },
  { role: "ai", text: "Booked! Confirmation sent to your phone." },
] as const;

const WAVE_BARS = 18;

export default function VoiceDemoCard() {
  const [visibleCount, setVisibleCount] = useState(0);

  // Reveal messages one by one, hold, then loop.
  useEffect(() => {
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      if (step <= messages.length) setVisibleCount(step);
      if (step >= messages.length + 4) {
        step = 0;
        setVisibleCount(0);
      }
    }, 750);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes voiceWave {
          0%, 100% { transform: scaleY(0.32); }
          50%      { transform: scaleY(1); }
        }
      `}</style>

      <div className="relative bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-xl shadow-brand-500/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-sm font-bold">Bookwise AI</p>
              <p className="text-muted-foreground text-xs">Receptionist</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500" />
            </span>
            <span className="text-brand-700 dark:text-brand-300 text-[11px] font-bold tracking-wide">
              LIVE
            </span>
          </div>
        </div>

        {/* Transcript */}
        <div className="flex flex-col gap-2.5 mb-5 min-h-[184px]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              } transition-all duration-500 ${
                i < visibleCount
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[82%] bg-muted text-foreground rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm leading-snug"
                    : "max-w-[88%] bg-brand-500/10 border border-brand-500/20 text-foreground rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-snug"
                }
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Live call bar */}
        <div className="flex items-center gap-3.5 bg-muted/60 border border-border rounded-2xl px-4 py-3">
          <div className="relative w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-60" />
            <Mic className="relative h-4 w-4" />
          </div>

          <div className="flex-1 flex items-center gap-[3px] h-8">
            {Array.from({ length: WAVE_BARS }).map((_, i) => (
              <span
                key={i}
                className="flex-1 h-7 rounded-full bg-brand-500 origin-center"
                style={{
                  animation: "voiceWave 1.1s ease-in-out infinite",
                  animationDelay: `${i * 60}ms`,
                }}
              />
            ))}
          </div>

          <span className="text-muted-foreground text-xs font-semibold shrink-0">
            0:18
          </span>
        </div>
      </div>
    </>
  );
}
