"use client";

import { Elements } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to {plan.name}</DialogTitle>
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
