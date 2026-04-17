"use client";

import { Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

interface StepDateTimeProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepDateTime({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  onNext,
  onBack,
}: StepDateTimeProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleDateChange(date: Date | undefined) {
    onDateChange(date);
    onTimeChange("");
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Pick a Date &amp; Time</h2>
      <p className="text-sm text-muted-foreground mt-1 mb-6">
        Select when you&apos;d like your appointment.
      </p>

      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateChange}
          disabled={(date) => date < today}
          className="rounded-xl border border-brand-500/20 dark:border-brand-500/10 p-3"
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
          <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => {
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
                      : "border-border bg-card text-muted-foreground hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400"
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
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
