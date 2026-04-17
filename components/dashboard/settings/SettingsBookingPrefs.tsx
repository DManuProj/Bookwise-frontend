"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";

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

const INITIAL: Prefs = {
  minLeadTimeMins: 60,
  bufferMins: 0,
  maxPerSlot: 1,
  cancelPolicy: "Cancellations must be made at least 24 hours in advance.",
};

const labelFor = (opts: { value: number; label: string }[], val: number) =>
  opts.find((o) => o.value === val)?.label ?? String(val);

const SettingsBookingPrefs = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState<Prefs>(INITIAL);
  const [draft, setDraft] = useState<Prefs>(INITIAL);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const handleCancel = () => {
    setDraft(saved);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // TODO: PUT /api/organisation/preferences
      await new Promise((res) => setTimeout(res, 800));
      setSaved(draft);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsCard
      title="Booking Preferences"
      description="Control how customers can book appointments"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSave}
    >
      {!isEditing ? (
        /* ── Read-only ── */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Minimum Notice",
              value: labelFor(MIN_LEAD_OPTIONS, saved.minLeadTimeMins),
            },
            {
              label: "Default Buffer",
              value: labelFor(BUFFER_OPTIONS, saved.bufferMins),
            },
            { label: "Max Per Slot", value: String(saved.maxPerSlot) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
          {saved.cancelPolicy && (
            <div className="sm:col-span-3">
              <p className="text-xs text-muted-foreground mb-0.5">
                Cancellation Policy
              </p>
              <p className="text-sm text-foreground">{saved.cancelPolicy}</p>
            </div>
          )}
        </div>
      ) : (
        /* ── Edit mode ── */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field>
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
                <SelectTrigger>
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
            </Field>

            <Field>
              <FieldLabel>Default Buffer</FieldLabel>
              <FieldDescription>Break time between bookings</FieldDescription>
              <Select
                value={String(draft.bufferMins)}
                onValueChange={(v) =>
                  setDraft((p) => ({ ...p, bufferMins: Number(v) }))
                }
              >
                <SelectTrigger>
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
            </Field>

            <Field>
              <FieldLabel>Max Per Slot</FieldLabel>
              <FieldDescription>Bookings allowed at same time</FieldDescription>
              <Select
                value={String(draft.maxPerSlot)}
                onValueChange={(v) =>
                  setDraft((p) => ({ ...p, maxPerSlot: Number(v) }))
                }
              >
                <SelectTrigger>
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
            </Field>
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
