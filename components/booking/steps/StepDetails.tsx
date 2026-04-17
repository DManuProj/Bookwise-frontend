"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { bookingDetailsSchema, BookingFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field";

interface StepDetailsProps {
  onSubmit: (data: BookingFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function StepDetails({
  onSubmit,
  onBack,
  isSubmitting,
}: StepDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingDetailsSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Your Details</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        We&apos;ll send your confirmation to these details.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              {...register("name")}
              placeholder="Sarah Johnson"
              className="pl-9"
              aria-invalid={!!errors.name}
            />
          </div>
          <FieldError errors={errors.name ? [errors.name] : []} />
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Email Address <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              {...register("email")}
              type="email"
              placeholder="sarah@email.com"
              className="pl-9"
              aria-invalid={!!errors.email}
            />
          </div>
          <FieldError errors={errors.email ? [errors.email] : []} />
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              {...register("phone")}
              type="tel"
              placeholder="+1 555 0100"
              className="pl-9"
              aria-invalid={!!errors.phone}
            />
          </div>
          <FieldError errors={errors.phone ? [errors.phone] : []} />
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Note <span className="text-xs text-muted-foreground font-normal">(optional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Textarea
              {...register("note")}
              placeholder="Any special requests or notes for your appointment..."
              className="pl-9 resize-none h-20"
            />
          </div>
          <FieldError errors={errors.note ? [errors.note] : []} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="h-11 flex-1 rounded-xl"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 flex-1 rounded-xl bg-brand-500 text-white hover:bg-brand-600 border-0 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                Confirm Booking
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
