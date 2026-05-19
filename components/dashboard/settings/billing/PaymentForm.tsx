"use client";

import { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
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
const stripeFieldStyle = {
  base: {
    fontSize: "15px",
    color: "#0f172a",
    fontFamily: "system-ui, -apple-system, sans-serif",
    "::placeholder": { color: "#94a3b8" },
  },
  invalid: { color: "#ef4444" },
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
      <div className="flex flex-col items-center py-8 gap-3">
        <CheckCircle2 className="h-12 w-12 text-brand-500" />
        <h3 className="text-lg font-bold text-foreground">
          Welcome to {plan.name}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          Your subscription is active.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Plan summary */}
      <div className="rounded-xl bg-muted/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          You are subscribing to
        </p>
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
          <p className="text-sm text-foreground">
            <span className="font-bold">${displayPrice.toFixed(2)}</span>
            <span className="text-muted-foreground">
              {period === "monthly" ? "/month" : "/year"}
            </span>
          </p>
        </div>
      </div>

      {/* Card input */}
      <div>
        {/* Card input — split into three fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Card number
            </label>
            <div className="rounded-xl border bg-background p-3.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition">
              <CardNumberElement
                options={{
                  style: stripeFieldStyle,
                  placeholder: "1234 1234 1234 1234",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Expiry
              </label>
              <div className="rounded-xl border bg-background p-3.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition">
                <CardExpiryElement
                  options={{
                    style: stripeFieldStyle,
                    placeholder: "MM / YY",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                CVC
              </label>
              <div className="rounded-xl border bg-background p-3.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition">
                <CardCvcElement
                  options={{
                    style: stripeFieldStyle,
                    placeholder: "123",
                  }}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Test card: 4242 4242 4242 4242 · any future expiry · any CVC
          </p>
        </div>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex gap-2 items-start">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!stripe || isProcessing}
          className="flex-1 rounded-xl bg-brand-500 hover:bg-brand-600 text-white"
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
