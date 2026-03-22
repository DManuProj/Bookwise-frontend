"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import Logo from "@/components/shared/Logo";
import Container from "@/components/shared/Container";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

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
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
       
             "bg-white/85 dark:bg-[#070e1d]/85 backdrop-blur-2xl shadow-sm shadow-black/5 border-b border-brand-500/15 dark:border-brand-500/20"
           
        
      `}
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Logo variant={isDark ? "light" : "dark"} />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/8 transition-all duration-150"
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
                className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-150"
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
              /* Skeleton while Clerk loads */
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-8 w-32 rounded-lg bg-brand-200 dark:bg-brand-900 animate-pulse" />
              </div>
            ) : !isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/10 font-medium"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-md shadow-brand-500/30 hover:shadow-lg hover:shadow-brand-500/40 hover:-translate-y-px transition-all duration-150"
                  >
                    Get Started Free
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

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-brand-500/10 transition-all"
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
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-brand-500/10 transition-all"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-brand-100 dark:border-white/5 bg-white/95 dark:bg-[#070e1d]/95 backdrop-blur-2xl">
          <Container>
            <div className="py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/8 px-3 py-2.5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 mt-2 border-t border-brand-100 dark:border-white/5 flex flex-col gap-2">
                {!isLoaded ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <div className="h-10 w-full rounded-lg bg-brand-200 dark:bg-brand-900 animate-pulse" />
                  </div>
                ) : !isSignedIn ? (
                  <>
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 dark:text-slate-300"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                      <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/30">
                        Get Started Free
                      </Button>
                    </SignUpButton>
                  </>
                ) : (
                  <>
                    <Button
                      className="w-full bg-brand-500 hover:bg-brand-600 text-white"
                      asChild
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <div className="px-3 py-2">
                      <UserButton />
                    </div>
                  </>
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
