import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Service" },
  { label: "Staff" },
  { label: "Date" },
  { label: "Details" },
];

interface BookingProgressProps {
  currentStep: number;
}

export default function BookingProgress({ currentStep }: BookingProgressProps) {
  return (
    <div className="flex items-start justify-center mb-8">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={step.label} className="flex items-start">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full font-medium text-sm transition-all",
                  isCompleted &&
                    "bg-brand-500 text-white",
                  isCurrent &&
                    "border-2 border-brand-500 bg-brand-500/15 text-brand-600 dark:text-brand-400",
                  !isCompleted &&
                    !isCurrent &&
                    "border-2 border-border bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span className="hidden text-xs font-medium text-muted-foreground sm:block">
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mt-[18px] h-px w-16 sm:w-20 transition-colors",
                  isCompleted ? "bg-brand-500" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
