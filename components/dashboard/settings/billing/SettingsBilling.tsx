"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PricingCards from "@/components/shared/PricingCards";
import {
  useBillingStatus,
  useCreatePortalSession,
  useSubscribe,
} from "@/hooks/api/useBilling";
import { getPlanByTier } from "@/lib/plans";
import type { Plan } from "@/lib/plans";
import type { PlanTier } from "@/types/enums";
import PaymentModal from "@/components/dashboard/settings/billing/PaymentModal";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const SettingsBilling = () => {
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useBillingStatus();
  const portalMutation = useCreatePortalSession();
  const subscribeMutation = useSubscribe();

  // Placeholder for modal state — Step 10 wires the actual PaymentModal
  const [pendingUpgrade, setPendingUpgrade] = useState<{
    plan: Plan;
    period: "monthly" | "yearly";
  } | null>(null);

  // Click handler for paid plan buttons in PricingCards
  const handleSelectPaid = async (plan: Plan, period: "monthly" | "yearly") => {
    if (!status) return;

    // Already has a subscription → plan SWITCH (no card capture needed)
    // Backend updates existing subscription, no clientSecret returned
    if (status.hasSubscription) {
      try {
        await subscribeMutation.mutateAsync({
          planTier: plan.tier as Exclude<PlanTier, "STARTER">,
          billingPeriod: period,
        });
        // Delayed refetch — gives webhook time to update DB
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: queryKeys.billing });
        }, 2000);
      } catch {}
      return;
    }

    // No subscription yet → NEW subscription, need to capture card via Stripe
    // Stash the chosen plan, Step 10 will open PaymentModal with this state
    setPendingUpgrade({ plan, period });
  };

  // "Manage subscription" → Stripe portal in new tab
  const handleManageSubscription = async () => {
    try {
      const { url } = await portalMutation.mutateAsync();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // Error toast handled inside useCreatePortalSession
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-6 lg:p-8">
        <p className="py-24 text-center text-muted-foreground">
          Unable to load billing information. Please refresh.
        </p>
      </div>
    );
  }

  const currentPlan = getPlanByTier(status.planTier);

  return (
    <div className="p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/dashboard/settings"
        className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to settings
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Billing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and payment method.
        </p>
      </div>

      {/* Current plan summary */}
      <div className="mx-auto mb-12 max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-brand-500/20 bg-card p-6 shadow-sm dark:border-brand-500/10">
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Current plan
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {currentPlan?.name ?? status.planTier}
                </h2>
                {currentPlan && currentPlan.monthlyPrice > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ${currentPlan.monthlyPrice.toFixed(2)}/month
                  </span>
                )}
                {currentPlan && currentPlan.monthlyPrice === 0 && (
                  <span className="text-sm text-muted-foreground">Free</span>
                )}
              </div>
            </div>

            {status.hasSubscription && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={portalMutation.isPending}
                className="h-11 rounded-xl"
              >
                {portalMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Manage subscription
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {status.cancelAtPeriodEnd && status.currentPeriodEnd && (
            <div className="relative mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Your {currentPlan?.name} plan ends on{" "}
                {new Date(status.currentPeriodEnd * 1000).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "long", day: "numeric" },
                )}
                . Switching plans will reactivate your subscription.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Plan grid */}
      <div className="mx-auto max-w-5xl">
        <PricingCards
          mode={{
            kind: "settings",
            currentTier: status.planTier,
            onSelectPaid: handleSelectPaid,
            isProcessing: subscribeMutation.isPending,
          }}
        />
      </div>

      {pendingUpgrade && (
        <PaymentModal
          plan={pendingUpgrade.plan}
          period={pendingUpgrade.period}
          open={!!pendingUpgrade}
          onOpenChange={(open) => {
            if (!open) setPendingUpgrade(null);
          }}
          onSuccess={() => setPendingUpgrade(null)}
        />
      )}
    </div>
  );
};

export default SettingsBilling;
