"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import Logo from "@/components/shared/Logo";
import Container from "@/components/shared/Container";
import { useTheme } from "next-themes";
import SignedInActions from "@/components/(landing-page)/SignedInActions";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const getStartedCta =
  "bg-primary text-primary-foreground hover:bg-brand-600 font-semibold shadow-md shadow-brand-500/30 hover:shadow-lg hover:shadow-brand-500/40 hover:-translate-y-px transition-all duration-150";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Logo asLink href="/" variant={isDark ? "light" : "dark"} />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium px-4 py-2 rounded-lg text-foreground/70 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-500/8 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-500/10 transition-all duration-150"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Auth buttons */}
            {!isLoaded ? (
              <div className="flex items-center gap-2">
                <div className="h-9 w-16 rounded-lg bg-muted animate-pulse" />
                <div className="h-9 w-32 rounded-lg bg-brand-500/15 animate-pulse" />
              </div>
            ) : !isSignedIn ? (
              <>
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-foreground/80 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-500/10 font-medium"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding">
                  <Button size="lg" className={getStartedCta}>
                    Get Started Free
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <SignedInActions />
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-brand-500/10 transition-all"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg text-foreground/80 hover:bg-brand-500/10 transition-all"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <Container>
            <div className="py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-sm font-medium text-foreground/80 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-500/8 px-3 py-2.5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 mt-2 border-t border-border flex flex-col gap-2">
                {!isLoaded ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
                    <div className="h-10 w-full rounded-lg bg-brand-500/15 animate-pulse" />
                  </div>
                ) : !isSignedIn ? (
                  <>
                    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground/80"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton
                      mode="modal"
                      fallbackRedirectUrl="/onboarding"
                    >
                      <Button className={`w-full ${getStartedCta}`}>
                        Get Started Free
                      </Button>
                    </SignUpButton>
                  </>
                ) : (
                  <SignedInActions />
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
};

export default Navbar;
