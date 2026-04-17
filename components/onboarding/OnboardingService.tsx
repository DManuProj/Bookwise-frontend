"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
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

import {
  ArrowLeft,
  Plus,
  Trash2,
  Scissors,
  Clock,
  DollarSign,
  CheckCircle2,
  Loader2,
  Handshake,
} from "lucide-react";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { serviceSchema, type Step4Data } from "@/types";
import { getCurrencyByCode } from "@/lib/countries";

const onBoardingServiceSchema = z.object({
  services: z.array(serviceSchema).min(1, "At least one service is required"),
});

type FormValues = z.infer<typeof onBoardingServiceSchema>;

/* ── Constants ── */
const DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
];

const BUFFERS = [
  { value: 0, label: "No buffer" },
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
];

/* ── Helpers ── */
const emptyService = () => ({
  name: "",
  duration: 60,
  price: 0,
  buffer: 0,
  description: "",
});

/* ── Props ── */
type Props = {
  initialData: Step4Data | null;
  currency: string;
  onComplete: (data: Step4Data) => void;
  onBack: () => void;
  isSubmitting: boolean;
};

/* ── Component ── */
const OnboardingServices = ({
  initialData,
  currency,
  onComplete,
  onBack,
  isSubmitting,
}: Props) => {
  const currencySymbol = getCurrencyByCode(currency)?.symbol ?? currency;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(onBoardingServiceSchema),
    mode: "onTouched", // ← validates on blur
    reValidateMode: "onChange",
    defaultValues: {
      services: initialData?.services?.length
        ? initialData.services
        : [emptyService()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  /* ── Submit ── */
  const onSubmit = (data: FormValues) => {
    onComplete({ services: data.services });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Add your services</h1>
        <p className="text-muted-foreground">Define what you offer.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Services */}
        <div className="space-y-5 mb-5">
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className=" dark:bg-card border border-brand-500/25"
            >
              <CardContent className="px-5 py-0">
                {/* Header */}
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Handshake className="h-4 w-4" />
                    <h4 className="text-foreground font-semibold text-lg">
                      Service {index + 1}
                    </h4>
                    {field.name && <Badge>{field.name}</Badge>}
                  </div>

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Name */}
                <Field className="mb-4">
                  <FieldLabel>Service Name *</FieldLabel>
                  <Input
                    {...register(`services.${index}.name`)}
                    className={
                      errors.services?.[index]?.name ? "border-destructive" : ""
                    }
                  />
                  <FieldError
                    errors={[errors.services?.[index]?.name].filter(Boolean)}
                  />
                </Field>

                {/* Duration */}
                <Field className="mb-4">
                  <FieldLabel>Duration *</FieldLabel>
                  <Select
                    defaultValue={String(field.duration)}
                    onValueChange={(v) =>
                      setValue(`services.${index}.duration`, Number(v), {
                        shouldValidate: true,
                      })
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
                  <FieldError
                    errors={[errors.services?.[index]?.duration].filter(
                      Boolean,
                    )}
                  />
                </Field>

                {/* Price */}
                <Field className="mb-4">
                  <FieldLabel>Price ({currency}) *</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      {currencySymbol}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      {...register(`services.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      className={`pl-9 ${
                        errors.services?.[index]?.price
                          ? "border-destructive"
                          : ""
                      }`}
                    />
                  </div>
                  <FieldError
                    errors={[errors.services?.[index]?.price].filter(Boolean)}
                  />
                </Field>

                {/* Buffer */}
                <Field className="mb-4">
                  <FieldLabel>Buffer</FieldLabel>
                  <Select
                    defaultValue={String(field.buffer)}
                    onValueChange={(v) =>
                      setValue(`services.${index}.buffer`, Number(v), {
                        shouldValidate: true,
                      })
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
                <Field>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea {...register(`services.${index}.description`)} />
                </Field>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Service */}
        <Button
          type="button"
          variant="outline"
          onClick={() => append(emptyService())}
          className="w-full mb-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add another service
        </Button>

        {/* Alert */}
        {errors.services?.root && (
          <Alert className="mb-6">
            <AlertDescription>{errors.services.root.message}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button type="submit" disabled={isSubmitting} className="flex-1">
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
      </form>
    </div>
  );
};

export default OnboardingServices;
