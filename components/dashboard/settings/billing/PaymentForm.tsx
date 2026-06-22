"use client";

import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { useSubscribe } from "@/hooks/api/useBilling";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { showSuccessToast } from "@/lib/errors";
import type { Plan } from "@/lib/plans";
import type { PlanTier } from "@/types/enums";

interface PaymentFormProps {
  plan: Plan;
  period: "monthly" | "yearly";
  onSuccess: () => void;
  onCancel: () => void;
}

// Read live theme tokens so Stripe's iframe text matches Aurora / Eclipse.
const getStripeFieldStyle = () => {
  const styles = getComputedStyle(document.documentElement);
  const read = (v: string, fallback: string) =>
    styles.getPropertyValue(v).trim()
      ? `hsl(${styles.getPropertyValue(v).trim()})`
      : fallback;
  return {
    base: {
      fontSize: "15px",
      color: read("--foreground", "#0f172a"),
      fontFamily: "system-ui, -apple-system, sans-serif",
      "::placeholder": { color: read("--muted-foreground", "#94a3b8") },
    },
    invalid: { color: "#ef4444" },
  };
};

const PaymentForm = ({
  plan,
  period,
  onSuccess,
  onCancel,
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const subscribeMutation = useSubscribe();
  const qc = useQueryClient();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [fieldStyle, setFieldStyle] = useState(() =>
    typeof window !== "undefined" ? getStripeFieldStyle() : undefined,
  );

  // Re-read tokens on mount and whenever the theme class flips
  useEffect(() => {
    const apply = () => setFieldStyle(getStripeFieldStyle());
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const displayPrice =
    period === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    if (isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setErrorMessage("Card field not loaded. Please refresh.");
      setIsProcessing(false);
      return;
    }

    try {
      // Backend creates subscription, returns clientSecret for card confirmation
      const result = await subscribeMutation.mutateAsync({
        planTier: plan.tier as Exclude<PlanTier, "STARTER">,
        billingPeriod: period,
      });

      if (!result.clientSecret) {
        setErrorMessage(
          "Unexpected response from server. Please contact support.",
        );
        setIsProcessing(false);
        return;
      }

      // Stripe confirms card client-side, handles 3DS popup if needed
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        result.clientSecret,
        {
          payment_method: { card: cardNumberElement },
        },
      );

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      // AFTER
      if (paymentIntent?.status === "succeeded") {
        showSuccessToast(`You're now on the ${plan.name} plan!`);
        setSucceeded(true);
        setTimeout(() => {
          qc.invalidateQueries({ queryKey: queryKeys.billing });
          onSuccess();
        }, 2000);
        return;
      }

      setErrorMessage(
        `Payment status: ${paymentIntent?.status ?? "unknown"}. Please contact support.`,
      );
      setIsProcessing(false);
    } catch {
      // Subscribe error toast handled inside useSubscribe
      setIsProcessing(false);
    }
  };

  // Success state — modal closes via onSuccess() after the setTimeout
  if (succeeded) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/20 opacity-60" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>
        </div>
        <h3 className="text-lg font-bold tracking-tight text-foreground">
          Welcome to {plan.name}
        </h3>
        <p className="text-center text-sm text-muted-foreground">
          Your subscription is active.
        </p>
      </div>
    );
  }

  const fieldWrapClass =
    "rounded-xl border border-input bg-background p-3.5 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20";

  return (
    <div className="space-y-5">
      {/* Plan summary */}
      <div className="rounded-xl border border-brand-500/15 bg-brand-500/[0.06] p-4 dark:bg-brand-500/10">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
          You are subscribing to
        </p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {plan.name}
          </h3>
          <p className="text-sm text-foreground">
            <span className="font-bold">${displayPrice.toFixed(2)}</span>
            <span className="text-muted-foreground">
              {period === "monthly" ? "/month" : "/year"}
            </span>
          </p>
        </div>
      </div>

      {/* Card input — split into three fields */}
      <div className="space-y-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Card number
          </label>
          <div className={fieldWrapClass}>
            <CardNumberElement
              options={{
                style: fieldStyle,
                placeholder: "1234 1234 1234 1234",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Expiry
            </label>
            <div className={fieldWrapClass}>
              <CardExpiryElement
                options={{
                  style: fieldStyle,
                  placeholder: "MM / YY",
                }}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              CVC
            </label>
            <div className={fieldWrapClass}>
              <CardCvcElement
                options={{
                  style: fieldStyle,
                  placeholder: "123",
                }}
              />
            </div>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Test card: 4242 4242 4242 4242 · any future expiry · any CVC
        </p>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="h-11 flex-1 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!stripe || isProcessing}
          className="h-11 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 disabled:opacity-70"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            `Pay $${displayPrice.toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
