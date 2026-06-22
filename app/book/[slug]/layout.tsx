"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-card/70 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm text-muted-foreground">Powered by</span>
              <span className="text-sm font-bold tracking-tight text-brand-600 dark:text-brand-400">
                Bookwise
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-500/10 transition-all duration-150"
              >
                {isDark ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
              </span>
              Secure booking
            </span>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
