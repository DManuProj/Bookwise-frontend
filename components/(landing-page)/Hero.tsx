"use client";

import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { useMe } from "@/hooks/api/useMe";
import VoiceDemoCard from "@/components/(landing-page)/VoiceDemoCard";

const primaryCta =
  "bg-primary text-primary-foreground hover:bg-brand-600 px-7 py-6 text-base font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all duration-200 group";

const secondaryCta =
  "px-7 py-6 text-base font-semibold rounded-xl border border-border bg-card text-foreground hover:border-brand-500/40 hover:bg-brand-500/5 transition-all duration-200";

const Hero = () => {
  const { data: me, isLoading } = useMe();
  const { isSignedIn, isLoaded } = useAuth();

  const ButtonSection = () => {
    // Still loading me data
    if (isLoading || !me) {
      return (
        <div className="flex items-center gap-4">
          <div className="h-12 w-44 rounded-xl bg-brand-500/10 animate-pulse" />
        </div>
      );
    }

    // OWNER + onboarding incomplete
    if (me.role === "OWNER" && !me.onboardingComplete) {
      return (
        <Button size="lg" className={primaryCta} asChild>
          <Link href="/onboarding">
            Continue Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      );
    }

    // STAFF + profile incomplete
    if (me.role !== "OWNER" && !me.profileComplete) {
      return (
        <Button size="lg" className={primaryCta} asChild>
          <Link href="/profile/setup">
            Complete Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      );
    }

    // Fully set up
    return (
      <Button size="lg" className={primaryCta} asChild>
        <Link href="/dashboard" className="text-amber-50">
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    );
  };

  return (
    <section className="relative overflow-hidden bg-section">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-brand-500/10 dark:bg-brand-500/20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[30rem] h-[30rem] rounded-full bg-brand-400/10 dark:bg-brand-500/10 blur-3xl" />
        {/* Grid — dark mode */}
        <div
          className="absolute inset-0 hidden dark:block opacity-50 [mask-image:radial-gradient(circle_at_72%_30%,black,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
        {/* Grid — light mode */}
        <div
          className="absolute inset-0 dark:hidden opacity-50 [mask-image:radial-gradient(circle_at_72%_30%,black,transparent_75%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,21,18,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16,21,18,0.04) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center py-28 md:py-32">
          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 mb-7">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-brand-700 dark:text-brand-300 text-sm font-semibold">
                AI Voice Receptionist — now live
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-bold tracking-tight text-foreground leading-[1.05] mb-6">
              Your AI booking assistant, working{" "}
              <span className="text-gradient">24/7</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mb-9 text-pretty">
              Customers book appointments just by talking to your AI assistant —
              so you never miss a booking, even at 2am.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              {!isLoaded ? (
                <div className="flex items-center gap-4">
                  <div className="h-12 w-44 rounded-xl bg-brand-500/10 animate-pulse" />
                  <div className="h-12 w-44 rounded-xl bg-muted animate-pulse" />
                </div>
              ) : !isSignedIn ? (
                <>
                  <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                    <Button size="lg" className={primaryCta}>
                      Start free today
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignUpButton>
                  <Button size="lg" className={secondaryCta} asChild>
                    <a href="#how-it-works">See how it works</a>
                  </Button>
                </>
              ) : (
                <ButtonSection />
              )}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Trusted by{" "}
                <strong className="text-foreground font-bold">500+</strong>{" "}
                service businesses
              </span>
            </div>
          </div>

          {/* Right — voice demo */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-500/20 blur-3xl pointer-events-none" />
            <div className="relative w-full max-w-md animate-float">
              <VoiceDemoCard />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
