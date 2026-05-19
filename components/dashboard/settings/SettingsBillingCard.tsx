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
      className="block rounded-2xl border bg-card hover:border-brand-500/40 hover:shadow-sm transition-all p-6 group"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground">Subscription</h3>
            {status?.cancelAtPeriodEnd && status?.currentPeriodEnd ? (
              <p className="text-sm text-amber-600 dark:text-amber-400 truncate">
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
              <p className="text-sm text-muted-foreground truncate">
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

        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      </div>
    </Link>
  );
};

export default SettingsBillingCard;
