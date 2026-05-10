"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";
import {
  useOrganisation,
  useUpdateOrganisation,
} from "@/hooks/api/useOrganisation";

const MIN_LEAD_OPTIONS = [
  { value: 0, label: "No minimum" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
  { value: 1440, label: "1 day" },
  { value: 2880, label: "2 days" },
];

const BUFFER_OPTIONS = [
  { value: 0, label: "No buffer" },
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
];

type Prefs = {
  minLeadTimeMins: number;
  bufferMins: number;
  maxPerSlot: number;
  cancelPolicy: string;
};

const labelFor = (opts: { value: number; label: string }[], val: number) =>
  opts.find((o) => o.value === val)?.label ?? String(val);

const SettingsBookingPrefs = () => {
  const { data: org, isLoading } = useOrganisation();
  const { mutate: updateOrg, isPending } = useUpdateOrganisation();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Prefs>({
    minLeadTimeMins: 0,
    bufferMins: 0,
    maxPerSlot: 1,
    cancelPolicy: "",
  });

  useEffect(() => {
    if (!org) return;
    setDraft({
      minLeadTimeMins: org.minLeadTimeMins,
      bufferMins: org.bufferMins,
      maxPerSlot: org.maxPerSlot,
      cancelPolicy: org.cancelPolicy ?? "",
    });
  }, [org]);

  if (isLoading || !org)
    return (
      <SettingsCard
        title="Booking Preferences"
        description="Control how customers can book appointments"
        isLoading={isLoading}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </SettingsCard>
    );

  const isDirty =
    draft.minLeadTimeMins !== org.minLeadTimeMins ||
    draft.bufferMins !== org.bufferMins ||
    draft.maxPerSlot !== org.maxPerSlot ||
    draft.cancelPolicy !== (org.cancelPolicy ?? "");

  const handleCancel = () => {
    setDraft({
      minLeadTimeMins: org.minLeadTimeMins,
      bufferMins: org.bufferMins,
      maxPerSlot: org.maxPerSlot,
      cancelPolicy: org.cancelPolicy ?? "",
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    updateOrg(
      {
        minLeadTimeMins: draft.minLeadTimeMins,
        bufferMins: draft.bufferMins,
        maxPerSlot: draft.maxPerSlot,
        cancelPolicy: draft.cancelPolicy,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  return (
    <SettingsCard
      title="Booking Preferences"
      description="Control how customers can book appointments"
      isEditing={isEditing}
      isSubmitting={isPending}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!isEditing ? (
        /* ── Read-only ── */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Minimum Notice",
                value: labelFor(MIN_LEAD_OPTIONS, org.minLeadTimeMins),
              },
              {
                label: "Default Buffer",
                value: labelFor(BUFFER_OPTIONS, org.bufferMins),
              },
              { label: "Max Per Slot", value: String(org.maxPerSlot) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">
              Cancellation Policy
            </p>
            <p
              className={`text-sm ${org.cancelPolicy ? "text-foreground" : "text-muted-foreground italic"}`}
            >
              {org.cancelPolicy ?? "N/A"}
            </p>
          </div>
        </div>
      ) : (
        /* ── Edit mode ── */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <FieldLabel>Minimum Notice</FieldLabel>
              <FieldDescription>
                How far in advance customers must book
              </FieldDescription>

              <Select
                value={String(draft.minLeadTimeMins)}
                onValueChange={(v) =>
                  setDraft((p) => ({ ...p, minLeadTimeMins: Number(v) }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {MIN_LEAD_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>Default Buffer</FieldLabel>
              <FieldDescription>Break time between bookings</FieldDescription>

              <Select
                value={String(draft.bufferMins)}
                onValueChange={(v) =>
                  setDraft((p) => ({ ...p, bufferMins: Number(v) }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {BUFFER_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>Max Per Slot</FieldLabel>
              <FieldDescription>Bookings allowed at same time</FieldDescription>

              <Select
                value={String(draft.maxPerSlot)}
                onValueChange={(v) =>
                  setDraft((p) => ({ ...p, maxPerSlot: Number(v) }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Field>
            <FieldLabel>Cancellation Policy</FieldLabel>
            <FieldDescription>
              Shown to customers on the booking page
            </FieldDescription>
            <Textarea
              className="resize-none h-20 text-sm"
              value={draft.cancelPolicy}
              onChange={(e) =>
                setDraft((p) => ({ ...p, cancelPolicy: e.target.value }))
              }
              placeholder="e.g. Cancellations must be made at least 24 hours in advance."
            />
          </Field>
        </div>
      )}
    </SettingsCard>
  );
};

export default SettingsBookingPrefs;
