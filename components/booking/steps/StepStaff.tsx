import { UserRound, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PublicOrgStaff } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StepStaffProps {
  staff: PublicOrgStaff[];
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

  const rowClass = (isSelected: boolean) =>
    cn(
      "group w-full rounded-2xl border p-4 text-left transition-all duration-200",
      isSelected
        ? "border-brand-500 bg-brand-500/[0.08] shadow-sm shadow-brand-500/10 dark:bg-brand-500/10"
        : "border-border hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-muted/40",
    );

  const checkClass = (isSelected: boolean) =>
    cn(
      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
      isSelected
        ? "border-brand-500 bg-brand-500 text-white"
        : "border-border bg-transparent text-transparent group-hover:border-brand-400",
    );

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Choose a Staff Member
      </h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        Pick someone you prefer, or let us assign the first available.
      </p>

      <div className="space-y-2.5">
        {/* No preference option */}
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-pressed={noPreferenceSelected}
          className={rowClass(noPreferenceSelected)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <UserRound className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  noPreferenceSelected
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-foreground",
                )}
              >
                No preference
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                We&apos;ll assign the first available staff member
              </p>
            </div>
            <span className={checkClass(noPreferenceSelected)}>
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </div>
        </button>

        {/* Staff members */}
        {staff.map((member) => {
          const isSelected = selected === member.id;
          const fullName = `${member.firstName} ${member.lastName}`;
          const initials = fullName
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
              aria-pressed={isSelected}
              className={rowClass(isSelected)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 shrink-0 ring-2 ring-brand-500/15">
                  {member.photoUrl && (
                    <AvatarImage src={member.photoUrl} alt={fullName} />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isSelected
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-foreground",
                    )}
                  >
                    {fullName}
                  </p>
                </div>
                <span className={checkClass(isSelected)}>
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-12 flex-1 rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="group h-12 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600"
        >
          Continue
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}
