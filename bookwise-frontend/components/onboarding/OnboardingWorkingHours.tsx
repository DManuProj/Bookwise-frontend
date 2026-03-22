"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Step2Data, WorkingHourRow } from "@/types";

/* ── Constants ── */
const DAYS: { key: WorkingHourRow["day"]; label: string }[] = [
  { key: "MON", label: "Monday" },
  { key: "TUE", label: "Tuesday" },
  { key: "WED", label: "Wednesday" },
  { key: "THU", label: "Thursday" },
  { key: "FRI", label: "Friday" },
  { key: "SAT", label: "Saturday" },
  { key: "SUN", label: "Sunday" },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  const value = `${h}:${m}`;
  const hour = parseInt(h);
  const suffix = hour < 12 ? "AM" : "PM";
  const display = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${m} ${suffix}`;
  return { value, display };
});

const DEFAULT_HOURS: WorkingHourRow[] = [
  { day: "MON", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "TUE", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "WED", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "THU", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "FRI", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "SAT", isOpen: true, openTime: "09:00", closeTime: "14:00" },
  { day: "SUN", isOpen: false, openTime: "09:00", closeTime: "17:00" },
];

/* ── Props ── */
type Props = {
  initialData: Step2Data | null;
  onComplete: (data: Step2Data) => void;
  onBack: () => void;
};

/* ── TimeSelect ── */
const TimeSelect = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) => (
  <Select value={value} onValueChange={onChange} disabled={disabled}>
    <SelectTrigger className="flex-1 h-9 text-sm">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {TIME_OPTIONS.map((t) => (
        <SelectItem key={t.value} value={t.value}>
          {t.display}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ── Main component ── */
const OnboardingWorkingHours = ({ initialData, onComplete, onBack }: Props) => {
  const [hours, setHours] = useState<WorkingHourRow[]>(
    initialData?.workingHours ?? DEFAULT_HOURS,
  );
  const [sameHours, setSameHours] = useState(false);
  const [sameOpen, setSameOpen] = useState("09:00");
  const [sameClose, setSameClose] = useState("18:00");
  const [error, setError] = useState<string | null>(null);

  const updateRow = (
    day: WorkingHourRow["day"],
    field: keyof WorkingHourRow,
    value: string | boolean,
  ) => {
    setHours((prev) =>
      prev.map((row) => (row.day === day ? { ...row, [field]: value } : row)),
    );
  };

  const applySameHours = (open: string, close: string) => {
    setHours((prev) =>
      prev.map((row) =>
        row.isOpen ? { ...row, openTime: open, closeTime: close } : row,
      ),
    );
  };

  const handleSubmit = () => {
    setError(null);
    const hasOpenDay = hours.some((r) => r.isOpen);
    if (!hasOpenDay) {
      setError("Please set at least one open day");
      return;
    }
    for (const row of hours) {
      if (row.isOpen && row.openTime >= row.closeTime) {
        setError(`${row.day}: closing time must be after opening time`);
        return;
      }
    }
    onComplete({ workingHours: hours });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Set your working hours
        </h1>
        <p className="text-muted-foreground">
          Customers will only be able to book during these times.
        </p>
      </div>

      {/* Same hours shortcut */}
      <Card className="mb-6 bg-brand-50 dark:bg-card    border border-brand-500/25">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-brand-500" />
              <Label className="text-sm font-medium cursor-pointer">
                Same hours every open day
              </Label>
            </div>
            <Switch checked={sameHours} onCheckedChange={setSameHours} />
          </div>

          {sameHours && (
            <div className="mt-4 pt-4 border-t border-brand-500/15 dark:border-white/10 flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-muted-foreground w-10 shrink-0">
                  Open
                </span>
                <TimeSelect
                  value={sameOpen}
                  onChange={(val) => {
                    setSameOpen(val);
                    applySameHours(val, sameClose);
                  }}
                />
              </div>
              <span className="text-muted-foreground text-sm shrink-0">→</span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-muted-foreground w-10 shrink-0">
                  Close
                </span>
                <TimeSelect
                  value={sameClose}
                  onChange={(val) => {
                    setSameClose(val);
                    applySameHours(sameOpen, val);
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Days */}
      <div className="space-y-2 mb-6">
        {DAYS.map(({ key, label }) => {
          const row = hours.find((r) => r.day === key)!;
          return (
            <Card
              key={key}
              className={`
                 border border-brand-500/25 
                transition-all duration-200 
                ${!row.isOpen ? "opacity-50" : ""}
              `}
            >
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-4">
                  {/* Switch */}
                  <Switch
                    checked={row.isOpen}
                    onCheckedChange={(val) => updateRow(key, "isOpen", val)}
                  />

                  {/* Day label */}
                  <Label className="text-sm font-medium text-foreground w-24 shrink-0">
                    {label}
                  </Label>

                  {/* Time selects or Closed */}
                  {row.isOpen ? (
                    <div className="flex items-center gap-2 flex-1">
                      <TimeSelect
                        value={row.openTime}
                        onChange={(val) => updateRow(key, "openTime", val)}
                      />
                      <span className="text-muted-foreground text-sm shrink-0">
                        to
                      </span>
                      <TimeSelect
                        value={row.closeTime}
                        onChange={(val) => updateRow(key, "closeTime", val)}
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 flex-1">
                        Closed
                      </div>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="flex-1 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={handleSubmit}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20"
        >
          Continue
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWorkingHours;
