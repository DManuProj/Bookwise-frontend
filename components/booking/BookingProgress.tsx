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
    <div className="mb-8 flex items-start justify-center">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={step.label} className="flex items-start">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                  isCompleted &&
                    "bg-primary text-primary-foreground shadow-md shadow-brand-500/30",
                  isCurrent &&
                    "border-2 border-brand-500 bg-brand-500/10 text-brand-600 ring-4 ring-brand-500/15 dark:text-brand-400",
                  !isCompleted &&
                    !isCurrent &&
                    "border-2 border-border bg-muted text-muted-foreground",
                )}
              >
                {/* pinging ring on the active step */}
                {isCurrent && (
                  <span className="absolute inset-0 animate-ping rounded-full border-2 border-brand-500/40" />
                )}
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-semibold transition-colors sm:block",
                  isCompleted && "text-foreground",
                  isCurrent && "text-brand-600 dark:text-brand-400",
                  !isCompleted && !isCurrent && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {index < STEPS.length - 1 && (
              <div className="mt-[19px] h-0.5 w-14 overflow-hidden rounded-full bg-border sm:w-20">
                <div
                  className={cn(
                    "h-full rounded-full bg-primary transition-[width] duration-500 ease-out",
                    isCompleted ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
