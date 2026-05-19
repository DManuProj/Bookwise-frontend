// types/billing.ts
import { PlanTier } from "./enums";

// GET /api/billing/status response
export interface BillingStatus {
  planTier: PlanTier;
  stripeCustomerId: string | null;
  hasSubscription: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: number | null;
}

// POST /api/billing/subscribe request body
export interface SubscribePayload {
  planTier: Exclude<PlanTier, "STARTER">;
  billingPeriod: "monthly" | "yearly";
}

// POST /api/billing/subscribe response
// Two shapes — new subscription vs plan switch
export interface SubscribeResponse {
  subscriptionId: string;
  clientSecret?: string; // only present for NEW subscriptions
  message?: string; // only present for plan switches
}

// POST /api/billing/portal response
export interface PortalResponse {
  url: string;
}

export interface ResourceUsage {
  used: number;
  limit: number | null; // null = unlimited
  atCap: boolean;
}

export interface TierUsage {
  planTier: PlanTier;
  staff: ResourceUsage;
  services: ResourceUsage;
  bookings: ResourceUsage;
  voiceMinutes: ResourceUsage;
}
