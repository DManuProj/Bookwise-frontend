"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";
import { WorkingHour } from "@/types";
import {
  useOrganisation,
  useUpdateWorkingHours,
} from "@/hooks/api/useOrganisation";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS: { key: WorkingHour["day"]; label: string }[] = [
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
  const { data: org, isLoading } = useOrganisation();

  const { mutate: updateHours, isPending } = useUpdateWorkingHours();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<WorkingHour[]>([]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(org?.workingHours);

  useEffect(() => {
    if (!org?.workingHours) return;
    setDraft(org.workingHours);
  }, [org]);

  if (isLoading || !org)
    return (
      <SettingsCard
        title="Working Hours"
        description="Customers can only book during these hours"
        isLoading={isLoading}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </SettingsCard>
    );

  const updateRow = (
    day: WorkingHour["day"],
    field: keyof WorkingHour,
    value: string | boolean,
  ) =>
    setDraft((prev) =>
      prev.map((r) => (r.day === day ? { ...r, [field]: value } : r)),
    );

  const handleCancel = () => {
    setDraft(org.workingHours);
    setIsEditing(false);
  };

  const handleSave = async () => {
    updateHours(draft, {
      onSuccess: () => setIsEditing(false),
    });
  };

  return (
    <SettingsCard
      title="Working Hours"
      description="Customers can only book during these hours"
      isEditing={isEditing}
      isLoading={isLoading}
      isSubmitting={isPending}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!isEditing ? (
        /* ── Read-only ── */
        <div className="space-y-0">
          {org.workingHours.map(({ day, isOpen, openTime, closeTime }) => {
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
