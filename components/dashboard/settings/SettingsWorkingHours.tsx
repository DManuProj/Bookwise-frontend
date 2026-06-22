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
    <SelectTrigger className="h-9 flex-1 rounded-lg text-sm">
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
            <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
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
                className="flex items-center justify-between border-b border-border py-2.5 last:border-0"
              >
                <span className="flex w-28 items-center gap-2 text-sm font-medium text-foreground">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-brand-500" : "bg-muted-foreground/40"}`}
                  />
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
                className={`flex items-center gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3 transition-opacity ${
                  !row.isOpen ? "opacity-60" : ""
                }`}
              >
                <Switch
                  checked={row.isOpen}
                  onCheckedChange={(v) => updateRow(key, "isOpen", v)}
                />
                <Label className="w-28 shrink-0 text-sm font-medium text-foreground">
                  {label}
                </Label>
                {row.isOpen ? (
                  <div className="flex flex-1 items-center gap-2">
                    <TimeSelect
                      value={row.openTime}
                      onChange={(v) => updateRow(key, "openTime", v)}
                    />
                    <span className="shrink-0 text-sm text-muted-foreground">
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
