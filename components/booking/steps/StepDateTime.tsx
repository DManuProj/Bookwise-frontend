"use client";

import { Clock, Loader2 } from "lucide-react";
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
      <h2 className="text-xl font-bold text-foreground">
        Pick a Date &amp; Time
      </h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        Select when you&apos;d like your appointment.
      </p>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          disabled={(date) => date < today}
          className={cn(
            "rounded-xl border border-brand-500/20 dark:border-brand-500/10 p-4",
            "[--cell-size:--spacing(11)]",
            "**:data-[selected-single=true]:bg-brand-500!",
            "**:data-[selected-single=true]:text-white!",
            "**:data-[selected-single=true]:hover:bg-brand-600!",
            "[&_button:not([data-selected-single=true]):not(:disabled):hover]:bg-brand-500/15!",
            "[&_button:not([data-selected-single=true]):not(:disabled):hover]:text-brand-600!",
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
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-brand-500" />
            <span className="text-sm font-medium text-foreground">
              Available times for{" "}
              <span className="text-brand-600 dark:text-brand-400">
                {format(selectedDate, "EEEE, MMM d")}
              </span>
            </span>
          </div>

          {/* Loading */}
          {isFetching && (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading available times...
            </div>
          )}

          {/* Empty */}
          {!isFetching && slots && slots.length === 0 && (
            <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
              <p className="text-sm font-medium text-foreground">
                No times available
              </p>
              <p className="text-xs text-muted-foreground mt-1">
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
                      "h-10 rounded-lg border text-xs font-medium transition-all duration-150",
                      isSelected
                        ? "bg-brand-500 border-brand-500 text-white shadow-sm shadow-brand-500/20"
                        : "border-border bg-card text-muted-foreground hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400",
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
          className="h-11 flex-1 rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="h-11 flex-1 rounded-xl bg-brand-500 text-white hover:bg-brand-600 border-0 shadow-sm shadow-brand-500/20 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
