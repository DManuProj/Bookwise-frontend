import { Clock, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Service } from "@/types";
import { CURRENCY } from "@/lib/countries";

interface StepServiceProps {
  services: Service[];
  selected: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
}

export default function StepService({
  services,
  selected,
  onSelect,
  onNext,
}: StepServiceProps) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Select a Service
      </h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        Choose what you&apos;d like to book today.
      </p>

      <div className="space-y-2.5">
        {services.map((service) => {
          const isSelected = selected === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              aria-pressed={isSelected}
              className={cn(
                "group w-full rounded-2xl border p-4 text-left transition-all duration-200",
                isSelected
                  ? "border-brand-500 bg-brand-500/[0.08] shadow-sm shadow-brand-500/10 dark:bg-brand-500/10"
                  : "border-border hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-muted/40",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isSelected
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-foreground",
                    )}
                  >
                    {service.name}
                  </p>
                  {service.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {service.durationMins} mins
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <p
                    className={cn(
                      "text-lg font-bold tracking-tight",
                      isSelected
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-foreground",
                    )}
                  >
                    {CURRENCY}
                    {service.price}
                  </p>
                  {/* selection check */}
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                      isSelected
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-border bg-transparent text-transparent group-hover:border-brand-400",
                    )}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={onNext}
        disabled={!selected}
        className="group mt-6 h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 disabled:opacity-50 disabled:shadow-none"
      >
        Continue
        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}
