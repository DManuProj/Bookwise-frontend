"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { PLANS, getMonthlyEquivalent, type Plan } from "@/lib/plans";
import type { PlanTier } from "@/types/enums";

export type PricingMode =
  | { kind: "landing-anonymous" }
  | { kind: "landing-signed-in" }
  | {
      kind: "settings";
      currentTier: PlanTier;
      onSelectPaid: (plan: Plan, period: "monthly" | "yearly") => void;
      isProcessing?: boolean;
    };

interface PricingCardsProps {
  mode: PricingMode;
}

const PricingCards = ({ mode }: PricingCardsProps) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <Label
          className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}
        >
          Monthly
        </Label>
        <button
          type="button"
          onClick={() => setIsYearly(!isYearly)}
          aria-label="Toggle billing period"
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isYearly ? "bg-brand-500" : "bg-muted-foreground/30"}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isYearly ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>

        <Label
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
        {PLANS.map((plan) => {
          const isHighlight = plan.tier === "PRO";
          const isFree = plan.monthlyPrice === 0;
          const displayPrice = isYearly
            ? getMonthlyEquivalent(plan)
            : plan.monthlyPrice;

          return (
            <div
              key={plan.tier}
              className={`relative rounded-2xl p-7 border transition-all duration-300 ${
                isHighlight
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
                  className={`text-lg font-bold mb-1 ${isHighlight ? "text-white" : "text-foreground"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-4 ${isHighlight ? "text-brand-100" : "text-muted-foreground"}`}
                >
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-black ${isHighlight ? "text-white" : "text-foreground"}`}
                  >
                    {/* ${isFree ? 0 : displayPrice.toFixed(2).replace(/\.00$/, "")} */}
                    ${isFree ? 0 : displayPrice.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm mb-1.5 ${isHighlight ? "text-brand-100" : "text-muted-foreground"}`}
                  >
                    /month
                  </span>
                </div>
                {isYearly && !isFree && (
                  <p
                    className={`text-xs mt-1 ${isHighlight ? "text-brand-100" : "text-brand-500"}`}
                  >
                    Billed ${plan.yearlyPrice}/year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${isHighlight ? "text-brand-100" : "text-brand-500"}`}
                    />
                    <span
                      className={`text-sm ${isHighlight ? "text-brand-50" : "text-foreground"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA — branches on mode */}
              <CTAButton
                plan={plan}
                isFree={isFree}
                isHighlight={isHighlight}
                isYearly={isYearly}
                mode={mode}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

// Extracted to keep the main map function readable.
// Returns the right button for each (plan, mode) combo.
interface CTAButtonProps {
  plan: Plan;
  isFree: boolean;
  isHighlight: boolean;
  isYearly: boolean;
  mode: PricingMode;
}

const CTAButton = ({
  plan,
  isFree,
  isHighlight,
  isYearly,
  mode,
}: CTAButtonProps) => {
  const buttonClasses = `w-full rounded-xl ${
    isHighlight
      ? "bg-white text-brand-600 hover:bg-brand-50"
      : "bg-brand-500 hover:bg-brand-600 text-white"
  }`;

  // Landing — not signed in
  if (mode.kind === "landing-anonymous") {
    return (
      <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
        <Button className={buttonClasses}>
          {isFree ? "Get started free" : "Get started"}
        </Button>
      </SignUpButton>
    );
  }

  // Landing — signed in
  if (mode.kind === "landing-signed-in") {
    return (
      <Button className={buttonClasses} asChild>
        <Link href={isFree ? "/dashboard" : "/dashboard/settings/billing"}>
          {isFree ? "Go to dashboard" : "Manage plan"}
        </Link>
      </Button>
    );
  }

  // Settings — current plan, upgrade, switch, or downgrade
  const isCurrent = plan.tier === mode.currentTier;

  if (isCurrent) {
    return (
      <Button className={`${buttonClasses} opacity-60 cursor-default`} disabled>
        Current plan
      </Button>
    );
  }

  // STARTER button when user is on a paid plan — can't self-downgrade
  if (isFree) {
    return (
      <Button
        className={`${buttonClasses} opacity-60 cursor-default`}
        disabled
        title="Cancel via Manage subscription"
      >
        Downgrade via portal
      </Button>
    );
  }

  // Paid plan, not current — upgrade or switch
  return (
    <Button
      className={buttonClasses}
      disabled={mode.isProcessing}
      onClick={() => mode.onSelectPaid(plan, isYearly ? "yearly" : "monthly")}
    >
      {mode.currentTier === "STARTER" ? "Upgrade" : "Switch to this plan"}
    </Button>
  );
};

export default PricingCards;
