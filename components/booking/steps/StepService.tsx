import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrgService } from "@/types";
import { Button } from "@/components/ui/button";

interface StepServiceProps {
  services: OrgService[];
  selected: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
  currency: string;
}

export default function StepService({
  services,
  selected,
  onSelect,
  onNext,
  currency,
}: StepServiceProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Select a Service</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        Choose what you&apos;d like to book today.
      </p>

      <div className="space-y-3">
        {services.map((service) => {
          const isSelected = selected === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              className={cn(
                "w-full text-left rounded-xl p-4 transition-all duration-150",
                isSelected
                  ? "border-2 border-brand-500 bg-brand-500/[0.08] dark:bg-brand-500/10"
                  : "border-2 border-border hover:border-brand-400/50 hover:bg-muted/30"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isSelected
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-foreground"
                    )}
                  >
                    {service.name}
                  </p>
                  {service.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {service.duration} mins
                    </span>
                  </div>
                </div>
                <p
                  className={cn(
                    "text-lg font-bold shrink-0",
                    isSelected
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-foreground"
                  )}
                >
                  {currency}{service.price}
                </p>
              </div>

              {isSelected && (
                <div className="border-t border-brand-500/20 mt-3 pt-2 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
                  <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                    Selected
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Button
        onClick={onNext}
        disabled={!selected}
        className="mt-6 h-11 w-full rounded-xl bg-brand-500 text-white hover:bg-brand-600 border-0 shadow-sm shadow-brand-500/20 disabled:opacity-50"
      >
        Continue
      </Button>
    </div>
  );
}
