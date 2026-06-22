"use client";

import Link from "next/link";
import { CreditCard, ChevronRight } from "lucide-react";
import { useBillingStatus } from "@/hooks/api/useBilling";
import { getPlanByTier } from "@/lib/plans";

const SettingsBillingCard = () => {
  const { data: status, isLoading } = useBillingStatus();

  const currentPlan = status ? getPlanByTier(status.planTier) : null;

  return (
    <Link
      href="/dashboard/settings/billing"
      className="group block rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
            <CreditCard className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold tracking-tight text-foreground">
              Subscription
            </h3>
            {status?.cancelAtPeriodEnd && status?.currentPeriodEnd ? (
              <p className="truncate text-sm text-amber-600 dark:text-amber-400">
                Cancels on{" "}
                {new Date(status.currentPeriodEnd * 1000).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                  },
                )}
              </p>
            ) : (
              <p className="truncate text-sm text-muted-foreground">
                {isLoading
                  ? "Loading..."
                  : currentPlan
                    ? `Currently on ${currentPlan.name}${
                        currentPlan.monthlyPrice > 0
                          ? ` · $${currentPlan.monthlyPrice.toFixed(2)}/mo`
                          : " · Free"
                      }`
                    : "Manage your plan"}
              </p>
            )}
          </div>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-brand-500/10 group-hover:text-brand-600 dark:group-hover:text-brand-400">
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};

export default SettingsBillingCard;
