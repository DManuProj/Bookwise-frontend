"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkingHourRow } from "@/types";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";

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

const fmt = (t: string) =>
  TIME_OPTIONS.find((o) => o.value === t)?.display ?? t;

const DEFAULT_HOURS: WorkingHourRow[] = [
  { day: "MON", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "TUE", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "WED", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "THU", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "FRI", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "SAT", isOpen: true, openTime: "09:00", closeTime: "14:00" },
  { day: "SUN", isOpen: false, openTime: "09:00", closeTime: "17:00" },
];

const TimeSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
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

const SettingsWorkingHours = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState<WorkingHourRow[]>(DEFAULT_HOURS);
  const [draft, setDraft] = useState<WorkingHourRow[]>(DEFAULT_HOURS);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const updateRow = (
    day: WorkingHourRow["day"],
    field: keyof WorkingHourRow,
    value: string | boolean,
  ) =>
    setDraft((prev) =>
      prev.map((r) => (r.day === day ? { ...r, [field]: value } : r)),
    );

  const handleCancel = () => {
    setDraft(saved);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // TODO: PUT /api/organisation/working-hours
      await new Promise((res) => setTimeout(res, 800));
      setSaved(draft);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsCard
      title="Working Hours"
      description="Customers can only book during these hours"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!isEditing ? (
        /* ── Read-only ── */
        <div className="space-y-0">
          {saved.map(({ day, isOpen, openTime, closeTime }) => {
            const label = DAYS.find((d) => d.key === day)?.label ?? day;
            return (
              <div
                key={day}
                className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
              >
                <span className="text-sm font-medium text-foreground w-28">
                  {label}
                </span>
                {isOpen ? (
                  <span className="text-sm text-muted-foreground">
                    {fmt(openTime)} — {fmt(closeTime)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground/50">
                    Closed
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Edit mode ── */
        <div className="space-y-2">
          {DAYS.map(({ key, label }) => {
            const row = draft.find((r) => r.day === key)!;
            return (
              <div
                key={key}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border border-brand-500/15 dark:border-brand-500/10 bg-muted/20 transition-opacity ${
                  !row.isOpen ? "opacity-50" : ""
                }`}
              >
                <Switch
                  checked={row.isOpen}
                  onCheckedChange={(v) => updateRow(key, "isOpen", v)}
                />
                <Label className="text-sm font-medium text-foreground w-28 shrink-0">
                  {label}
                </Label>
                {row.isOpen ? (
                  <div className="flex items-center gap-2 flex-1">
                    <TimeSelect
                      value={row.openTime}
                      onChange={(v) => updateRow(key, "openTime", v)}
                    />
                    <span className="text-sm text-muted-foreground shrink-0">
                      to
                    </span>
                    <TimeSelect
                      value={row.closeTime}
                      onChange={(v) => updateRow(key, "closeTime", v)}
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SettingsCard>
  );
};

export default SettingsWorkingHours;
