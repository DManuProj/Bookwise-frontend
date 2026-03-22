"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { useTheme } from "next-themes";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Sun, Moon } from "lucide-react";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const isDark = mounted && theme === "dark";

  useEffect(() => {
    setMounted(true);

    // Native browser warning on reload / tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPendingHref("/");
    setShowWarning(true);
  };

  const handleLeave = () => {
    if (pendingHref) router.push(pendingHref);
    setShowWarning(false);
  };

  const handleStay = () => {
    setShowWarning(false);
    setPendingHref(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal top bar — logo only */}
      <header className="border-b border-border dark:bg-[#070e1d]/85 sticky top-0 z-40 backdrop-blur-md bg-background/80">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={handleLogoClick} className="cursor-pointer">
            {mounted && (
              <Logo variant={theme === "dark" ? "light" : "dark"} asLink={false} />
            )}
          </button>
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-150"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Auth */}
            {!isLoaded ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-8 w-24 rounded-lg bg-brand-200 dark:bg-brand-900 animate-pulse" />
              </div>
            ) : !isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="bg-brand-500 hover:bg-brand-600 text-white"
                  >
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  className="bg-brand-500 hover:bg-brand-600 text-white"
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Navigation warning modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleStay}
          />

          {/* Modal */}
          <div className="relative bg-background border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <button
              onClick={handleStay}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Leave setup?
              </h3>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Your progress will be lost if you leave now. You can always
              complete setup later from your dashboard.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleLeave}
              >
                Leave anyway
              </Button>
              <Button
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
                onClick={handleStay}
              >
                Continue setup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingLayout;
