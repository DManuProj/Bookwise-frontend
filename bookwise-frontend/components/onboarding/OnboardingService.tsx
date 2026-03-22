"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import type { Step4Data, OnboardingService, StaffMember } from "@/types";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Scissors,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

/* ── Constants ── */
const DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 150, label: "2.5 hours" },
  { value: 180, label: "3 hours" },
];

const BUFFERS = [
  { value: 0, label: "No buffer" },
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
];

/* ── Types ── */
type Props = {
  initialData: Step4Data | null;
  staff: StaffMember[];
  currency: string;
  onComplete: (data: Step4Data) => void;
  onBack: () => void;
  isSubmitting: boolean;
};

/* ── Helpers ── */
const emptyService = (): OnboardingService => ({
  id: uuidv4(),
  name: "",
  duration: 60,
  price: 0,
  buffer: 0,
  description: "",
  staffIds: [],
});

const getCurrencySymbol = (currency: string) =>
  currency.match(/\((.+)\)/)?.[1] ?? "$";

/* ── Component ── */
const OnboardingServices = ({
  initialData,
  staff,
  currency,
  onComplete,
  onBack,
  isSubmitting,
}: Props) => {
  const [services, setServices] = useState<OnboardingService[]>(
    initialData?.services.length ? initialData.services : [emptyService()],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = getCurrencySymbol(currency);

  /* ── Add service ── */
  const handleAdd = () => setServices((prev) => [...prev, emptyService()]);

  /* ── Remove service ── */
  const handleRemove = (id: string) => {
    if (services.length === 1) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next)
        .filter((k) => k.startsWith(id))
        .forEach((k) => delete next[k]);
      return next;
    });
  };

  /* ── Update field ── */
  const updateField = (
    id: string,
    field: keyof OnboardingService,
    value: string | number | string[],
  ) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${id}-${field}`];
      return next;
    });
  };

  /* ── Toggle staff assignment ── */
  const toggleStaff = (serviceId: string, staffId: string) => {
    const service = services.find((s) => s.id === serviceId)!;
    const updated = service.staffIds.includes(staffId)
      ? service.staffIds.filter((id) => id !== staffId)
      : [...service.staffIds, staffId];
    updateField(serviceId, "staffIds", updated);
  };

  /* ── Validate ── */
  const validate = () => {
    const newErrors: Record<string, string> = {};
    for (const svc of services) {
      if (!svc.name.trim()) {
        newErrors[`${svc.id}-name`] = "Service name is required";
      }
      if (svc.price < 0) {
        newErrors[`${svc.id}-price`] = "Price cannot be negative";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = () => {
    if (!validate()) return;
    onComplete({ services });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Add your services
        </h1>
        <p className="text-muted-foreground">
          Define what you offer. You can add more services later from your
          dashboard.
        </p>
      </div>

      {/* Service cards */}
      <div className="space-y-5 mb-5">
        {services.map((svc, index) => (
          <Card key={svc.id} className="border border-brand-500/25">
            <CardContent className="p-5">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                    <Scissors className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      Service {index + 1}
                    </span>
                    {svc.name && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0"
                      >
                        {svc.name}
                      </Badge>
                    )}
                  </div>
                </div>

                {services.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(svc.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {/* Service name */}
              <Field className="mb-4">
                <FieldLabel>Service Name *</FieldLabel>
                <Input
                  value={svc.name}
                  onChange={(e) => updateField(svc.id, "name", e.target.value)}
                  placeholder="e.g. Haircut, Deep Tissue Massage"
                  className={
                    errors[`${svc.id}-name`] ? "border-destructive" : ""
                  }
                />
                <FieldError
                  errors={[{ message: errors[`${svc.id}-name`] }].filter(
                    (e) => e.message,
                  )}
                />
              </Field>

              {/* Duration + Price */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Field>
                  <FieldLabel>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Duration *
                    </span>
                  </FieldLabel>
                  <Select
                    value={String(svc.duration)}
                    onValueChange={(v) =>
                      updateField(svc.id, "duration", Number(v))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((d) => (
                        <SelectItem key={d.value} value={String(d.value)}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Price ({currency})
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={svc.price}
                      onChange={(e) =>
                        updateField(svc.id, "price", Number(e.target.value))
                      }
                      className={`pl-7 ${errors[`${svc.id}-price`] ? "border-destructive" : ""}`}
                    />
                  </div>
                  <FieldError
                    errors={[{ message: errors[`${svc.id}-price`] }].filter(
                      (e) => e.message,
                    )}
                  />
                </Field>
              </div>

              {/* Buffer */}
              <Field className="mb-4">
                <FieldLabel>Buffer Time</FieldLabel>
                <FieldDescription>Break time between bookings</FieldDescription>
                <Select
                  value={String(svc.buffer)}
                  onValueChange={(v) =>
                    updateField(svc.id, "buffer", Number(v))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUFFERS.map((b) => (
                      <SelectItem key={b.value} value={String(b.value)}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Description */}
              <Field className="mb-4">
                <FieldLabel>Description</FieldLabel>
                <FieldDescription>Optional</FieldDescription>
                <Textarea
                  value={svc.description}
                  onChange={(e) =>
                    updateField(svc.id, "description", e.target.value)
                  }
                  placeholder="Brief description of this service..."
                  className="resize-none h-20 text-sm"
                />
              </Field>

              {/* Assign staff */}
              {staff.length > 0 && (
                <>
                  <Separator className="mb-4" />
                  <Field>
                    <FieldLabel>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Assign to staff
                      </span>
                    </FieldLabel>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {staff.map((member) => {
                        const assigned = svc.staffIds.includes(member.id);
                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => toggleStaff(svc.id, member.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                              assigned
                                ? "bg-brand-500/15 border-brand-500/40 text-brand-700 dark:text-brand-400"
                                : "bg-transparent border-border text-muted-foreground hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400"
                            }`}
                          >
                            {assigned && (
                              <CheckCircle2 className="h-3 w-3 shrink-0" />
                            )}
                            <span>
                              {member.name || "Unnamed"}
                              {member.isOwner && " (you)"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add service button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed hover:border-brand-400 hover:bg-brand-500/5 hover:text-brand-600 dark:hover:text-brand-400 text-muted-foreground mb-6"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add another service
      </Button>

      {/* Min 1 service note */}
      {services.length === 1 && (
        <Alert className="mb-6">
          <AlertDescription className="text-xs text-muted-foreground">
            At least one service is required to continue.
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Setup
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingServices;
