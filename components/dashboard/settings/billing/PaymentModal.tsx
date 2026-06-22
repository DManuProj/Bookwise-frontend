"use client";

import { Elements } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";
import PaymentForm from "./PaymentForm";
import { getStripe } from "@/lib/stripe";
import type { Plan } from "@/lib/plans";

interface PaymentModalProps {
  plan: Plan;
  period: "monthly" | "yearly";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PaymentModal = ({
  plan,
  period,
  open,
  onOpenChange,
  onSuccess,
}: PaymentModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
              <CreditCard className="h-4.5 w-4.5" />
            </span>
            Upgrade to {plan.name}
          </DialogTitle>
          <DialogDescription>
            Enter your payment details to start your subscription.
          </DialogDescription>
        </DialogHeader>

        <Elements stripe={getStripe()}>
          <PaymentForm
            plan={plan}
            period={period}
            onSuccess={onSuccess}
            onCancel={() => onOpenChange(false)}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
