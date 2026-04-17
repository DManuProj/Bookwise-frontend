import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrgStaff } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface StepStaffProps {
  staff: OrgStaff[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepStaff({
  staff,
  selected,
  onSelect,
  onNext,
  onBack,
}: StepStaffProps) {
  const noPreferenceSelected = selected === null;

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Choose a Staff Member</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        Pick someone you prefer, or let us assign the first available.
      </p>

      <div className="space-y-3">
        {/* No preference option */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "w-full text-left rounded-xl p-4 transition-all duration-150",
            noPreferenceSelected
              ? "border-2 border-brand-500 bg-brand-500/[0.08] dark:bg-brand-500/10"
              : "border-2 border-border hover:border-brand-400/50 hover:bg-muted/30"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <UserRound className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-semibold",
                  noPreferenceSelected
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-foreground"
                )}
              >
                No preference
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                We&apos;ll assign the first available staff member
              </p>
            </div>
          </div>
          {noPreferenceSelected && (
            <div className="border-t border-brand-500/20 mt-3 pt-2 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                Selected
              </span>
            </div>
          )}
        </button>

        {/* Staff members */}
        {staff.map((member) => {
          const isSelected = selected === member.id;
          const initials = member.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelect(member.id)}
              className={cn(
                "w-full text-left rounded-xl p-4 transition-all duration-150",
                isSelected
                  ? "border-2 border-brand-500 bg-brand-500/[0.08] dark:bg-brand-500/10"
                  : "border-2 border-border hover:border-brand-400/50 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-brand-500/10">
                  {member.photo && (
                    <AvatarImage src={member.photo} alt={member.name} />
                  )}
                  <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isSelected
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-foreground"
                    )}
                  >
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {member.role.toLowerCase()}
                  </p>
                </div>
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

      <div className="mt-6 flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-11 flex-1 rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="h-11 flex-1 rounded-xl bg-brand-500 text-white hover:bg-brand-600 border-0 shadow-sm shadow-brand-500/20"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
