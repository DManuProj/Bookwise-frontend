import type { PlanTier } from "@/types/enums";

export type BillingPeriod = "monthly" | "yearly";

export interface Plan {
  tier: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number; // total per year, not per month
  badge: string | null;
  features: string[];
}

export const PLANS: readonly Plan[] = [
  {
    tier: "STARTER",
    name: "Starter",
    description: "Perfect for solo operators just getting started.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    features: [
      "Up to 2 staff members",
      "Up to 10 services",
      "30 bookings per month",
      "Public booking page",
      "Email confirmations",
      "Customer database",
      "Basic analytics",
    ],
  },
  {
    tier: "PRO",
    name: "Pro",
    description: "Everything you need to grow your service business.",
    monthlyPrice: 29.99,
    yearlyPrice: 287.99,
    badge: "Most Popular",
    features: [
      "Up to 10 staff members",
      "Unlimited services",
      "Unlimited bookings",
      "AI voice agent (100 min/month)",
      "Email notifications",
      "Customer database",
      "Full analytics",
    ],
  },
  {
    tier: "BUSINESS",
    name: "Business",
    description: "For established businesses with larger teams.",
    monthlyPrice: 79.99,
    yearlyPrice: 767.99,
    badge: null,
    features: [
      "Unlimited staff",
      "Unlimited services",
      "Unlimited bookings",
      "Unlimited AI voice minutes",
      "Email notifications",
      "Customer database",
      "Full analytics + exports (PDF/CSV)",
      "Priority support",
    ],
  },
] as const;

// Helper: get the price per month when paying yearly (for toggle UI)
// e.g. PRO yearly $287.99 → $24.00/mo when displayed as "per month"
export const getMonthlyEquivalent = (plan: Plan): number => {
  if (plan.yearlyPrice === 0) return 0;
  return plan.yearlyPrice / 12;
};

// Helper: find a plan by tier
export const getPlanByTier = (tier: PlanTier): Plan | undefined =>
  PLANS.find((p) => p.tier === tier);
