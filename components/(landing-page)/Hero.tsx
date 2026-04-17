"use client";

import { ArrowRight, Mic, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Container from "@/components/shared/Container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_TYPES } from "@/lib/countries";

const Hero = () => {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-section">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-brand-400 rounded-full opacity-5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Container className="relative z-10 py-32 md:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
            </span>
            <span className="text-brand-400 text-sm font-medium">
              AI Voice Receptionist — Now Available
            </span>
          </div>

          {/* Headline — always white, Hero is always dark */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Your AI Booking Assistant,
            <br />
            <span className="text-gradient">Working 24/7</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Bookwise lets customers book appointments by talking to your AI
            assistant online — so you never miss a booking, even at 2am.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            {!isLoaded ? (
              <div className="flex items-center gap-4">
                <div className="h-12 w-40 rounded-xl bg-brand-800/50 animate-pulse" />
                <div className="h-12 w-40 rounded-xl bg-white/5 animate-pulse" />
              </div>
            ) : !isSignedIn ? (
              <>
                <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                  <Button
                    size="lg"
                    className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    Start Free Today
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignUpButton>
                <Button
                  // variant="outline"
                  size="lg"
                  className="px-8 py-6 text-base rounded-xl border border-teal-600 transition-all duration-200 hover:border-teal-700! "
                  asChild
                >
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-brand-500/25"
                asChild
              >
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mb-16">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="dark:text-slate-400 text-slate-900 text-sm">
              Trusted by{" "}
              <span className="text-foreground! font-bold">500+</span> service
              businesses
            </span>
          </div>

          {/* Floating chat card */}
          <div className="relative max-w-sm mx-auto animate-float">
            <div className="absolute inset-0 bg-brand-500 opacity-20 blur-2xl rounded-3xl" />
            <div className="relative bg-slate-900 dark:bg-slate-900/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-6 text-left shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
                    <Mic className="h-4 w-4 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      AI Receptionist
                    </p>
                    <p className="text-slate-500 text-xs">Bookwise Voice</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/20 border border-brand-500/30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500" />
                  </span>
                  <span className="text-brand-400 text-xs font-medium">
                    Live
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-slate-700/60 rounded-2xl rounded-tr-sm px-3.5 py-2 max-w-[80%]">
                    <p className="text-slate-200 text-sm">
                      I want a haircut Saturday morning
                    </p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-brand-500/20 border border-brand-500/20 rounded-2xl rounded-tl-sm px-3.5 py-2 max-w-[85%]">
                    <p className="text-slate-200 text-sm">
                      We have 9am, 10:30am and 11am with James. Which works
                      best?
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-slate-700/60 rounded-2xl rounded-tr-sm px-3.5 py-2">
                    <p className="text-slate-200 text-sm">10:30am please!</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-brand-500/20 border border-brand-500/20 rounded-2xl rounded-tl-sm px-3.5 py-2 max-w-[85%]">
                    <p className="text-slate-200 text-sm">
                      ✅ Booked! Confirmation sent to your phone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 justify-center">
                {[3, 5, 8, 5, 10, 7, 4, 9, 6, 4, 8, 5, 3, 6, 9, 5, 4].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="bg-brand-500 rounded-full opacity-60"
                      style={{ width: "3px", height: `${h * 2}px` }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
