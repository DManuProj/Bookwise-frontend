"use client";

import { Clock, Loader2, CalendarX2, ArrowRight } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { usePublicSlots } from "@/hooks/api/usePublicBooking";

interface StepDateTimeProps {
  slug: string;
  serviceId: string;
  staffId: string | null;
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDateTime({
  slug,
  serviceId,
  staffId,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onNext,
  onBack,
}: StepDateTimeProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateParam = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const { data: slots, isFetching } = usePublicSlots(
    slug,
    serviceId,
    staffId,
    dateParam,
  );

  function handleDateChange(date: Date | undefined) {
    onDateChange(date);
    onTimeChange("");
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Pick a Date &amp; Time
      </h2>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        Select when you&apos;d like your appointment.
      </p>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          disabled={(date) => date < today}
          className={cn(
            "rounded-2xl border border-border bg-card p-4 shadow-sm",
            "[--cell-size:--spacing(11)]",
            "**:data-[selected-single=true]:bg-brand-500!",
            "**:data-[selected-single=true]:text-white!",
            "**:data-[selected-single=true]:rounded-xl!",
            "**:data-[selected-single=true]:shadow-md!",
            "**:data-[selected-single=true]:shadow-brand-500/30!",
            "**:data-[selected-single=true]:hover:bg-brand-600!",
            "[&_button:not([data-selected-single=true]):not(:disabled):hover]:bg-brand-500/15!",
            "[&_button:not([data-selected-single=true]):not(:disabled):hover]:text-brand-600!",
            "[&_button:not([data-selected-single=true]):not(:disabled):hover]:rounded-xl!",
            "dark:[&_button:not([data-selected-single=true]):not(:disabled):hover]:text-brand-400!",
          )}
          classNames={{
            weekdays: "flex gap-1.5",
            week: "mt-2 flex w-full gap-1.5",
          }}
        />
      </div>

      {selectedDate && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Available times for{" "}
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {format(selectedDate, "EEEE, MMM d")}
              </span>
            </span>
          </div>

          {/* Loading */}
          {isFetching && (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-500" />
              Loading available times…
            </div>
          )}

          {/* Empty */}
          {!isFetching && slots && slots.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-border bg-muted/30 px-6 py-8 text-center">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <CalendarX2 className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                No times available
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Please choose another day.
              </p>
            </div>
          )}

          {/* Slots */}
          {!isFetching && slots && slots.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onTimeChange(slot)}
                    className={cn(
                      "h-11 rounded-xl border text-xs font-semibold transition-all duration-150",
                      isSelected
                        ? "border-brand-500 bg-primary text-primary-foreground shadow-md shadow-brand-500/25"
                        : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-brand-500/[0.06] hover:text-brand-600 dark:hover:text-brand-400",
                    )}
                  >
                    {format(parse(slot, "HH:mm", new Date()), "h:mm a")}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

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
          disabled={!selectedDate || !selectedTime}
          className="group h-12 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 disabled:opacity-50 disabled:shadow-none"
        >
          Continue
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}
