"use client";

import Container from "@/components/shared/Container";
import { useAuth } from "@clerk/nextjs";
import PricingCards from "@/components/shared/PricingCards";

const Pricing = () => {
  const { isSignedIn } = useAuth();

  return (
    <section id="pricing" className="relative overflow-hidden bg-section py-24">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-brand-500/8 dark:bg-brand-500/12 blur-3xl" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <PricingCards
          mode={
            isSignedIn
              ? { kind: "landing-signed-in" }
              : { kind: "landing-anonymous" }
          }
        />
      </Container>
    </section>
  );
};

export default Pricing;
