"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import { CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for solo operators just getting started.",
    highlight: false,
    badge: null,
    features: [
      "1 staff member",
      "50 bookings per month",
      "Public booking page",
      "Manual booking flow",
      "Email confirmations",
      "Basic analytics",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 23,
    description: "Everything you need to grow your service business.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "5 staff members",
      "Unlimited bookings",
      "Everything in Starter",
      "Voice AI receptionist",
      "Custom branding",
      "Analytics dashboard",
      "Embeddable widget",
      "SMS reminders",
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
  },
  {
    name: "Business",
    monthlyPrice: 79,
    yearlyPrice: 63,
    description: "For established businesses with larger teams.",
    highlight: false,
    badge: null,
    features: [
      "Unlimited staff",
      "Everything in Pro",
      "WhatsApp AI channel",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <section id="pricing" className="bg-section py-24">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label
            className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
          >
            Monthly
          </Label>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isYearly ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-600"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isYearly ? "translate-x-1" : "-translate-x-5"}`}
            />
          </button>

          <Label
            htmlFor="yearly"
            className={`text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}
          >
            Yearly
          </Label>
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full">
            Save 20%
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-brand-500 border-brand-400 shadow-2xl shadow-brand-500/25 scale-[1.03]"
                  : "card-surface card-hover"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-white text-brand-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    <Zap className="h-3 w-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-6">
                <h3
                  className={`text-lg font-bold mb-1 ${plan.highlight ? "text-white" : "text-foreground"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${plan.highlight ? "text-brand-100" : "text-muted-foreground"}`}
                >
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-black ${plan.highlight ? "text-white" : "text-foreground"}`}
                  >
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span
                    className={`text-sm mb-1.5 ${plan.highlight ? "text-brand-100" : "text-muted-foreground"}`}
                  >
                    /month
                  </span>
                </div>
                {isYearly && plan.monthlyPrice > 0 && (
                  <p
                    className={`text-xs mt-1 ${plan.highlight ? "text-brand-100" : "text-brand-500"}`}
                  >
                    Billed ${plan.yearlyPrice * 12}/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-brand-100" : "text-brand-500"}`}
                    />
                    <span
                      className={`text-sm ${plan.highlight ? "text-brand-50" : "text-foreground"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.name === "Business" ? (
                <Button variant="outline" className="w-full rounded-xl" asChild>
                  <Link href="mailto:hello@bookwise.ai">Contact Sales</Link>
                </Button>
              ) : isSignedIn ? (
                <Button
                  className={`w-full rounded-xl ${
                    plan.highlight
                      ? "bg-white text-brand-600 hover:bg-brand-50"
                      : "bg-brand-500 hover:bg-brand-600 text-white"
                  }`}
                  asChild
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
                  <Button
                    className={`w-full rounded-xl ${
                      plan.highlight
                        ? "bg-white text-brand-600 hover:bg-brand-50"
                        : "bg-brand-500 hover:bg-brand-600 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </SignUpButton>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Pricing;
