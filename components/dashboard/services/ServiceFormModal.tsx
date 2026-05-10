"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { CheckCircle2, Loader2, DollarSign, Clock, Zap } from "lucide-react";
import { ServiceFormInputs, serviceSchema, type Service } from "@/types";

/* ── Zod schema ── */
const serviceFormSchema = serviceSchema.extend({ isActive: z.boolean() });

type FormValues = z.infer<typeof serviceFormSchema>;

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

/* ── Props ── */
type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (service: ServiceFormInputs) => void;
  editService: Service | null; // null = add mode, Service = edit mode
  currency: string;
  isSubmitting: boolean;
};

/* ── Component ── */
const ServiceFormModal = ({
  open,
  onClose,
  onSave,
  editService,
  currency,
  isSubmitting,
}: Props) => {
  const isEdit = !!editService;

  const [durationMins, setDuration] = useState(60);
  const [buffer, setBuffer] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(serviceFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      durationMins: 60,
      price: 0,
      buffer: 0,
      description: "",
      isActive: true,
    },
  });

  /* ── Populate form when editing ── */
  useEffect(() => {
    if (editService) {
      reset({
        name: editService.name,
        durationMins: editService.durationMins,
        price: editService.price,
        buffer: editService.buffer,
        description: editService.description ?? "",
        isActive: editService.isActive,
      });
      setDuration(editService.durationMins);
      setBuffer(editService.buffer);
      setIsActive(editService.isActive);
    } else {
      reset({
        name: "",
        durationMins: 60,
        price: 0,
        buffer: 0,
        description: "",
        isActive: true,
      });
      setDuration(60);
      setBuffer(0);
      setIsActive(true);
    }
  }, [editService, open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    onSave(values);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full p-0 gap-0 overflow-hidden">
        {/* Fixed header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Edit Service" : "Add Service"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Update the details of this service."
              : "Add a new service for customers to book."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto px-6 py-5 space-y-4
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-brand-500/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-brand-500/40"
          style={{ maxHeight: "calc(90vh - 160px)" }}
        >
          <form
            id="service-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Name */}
            <Field>
              <FieldLabel>Service Name *</FieldLabel>
              <Input
                placeholder="e.g. Haircut, Deep Tissue Massage"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            {/* Duration + Price */}
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Duration *
                  </span>
                </FieldLabel>
                <Select
                  value={String(durationMins)}
                  onValueChange={(v) => {
                    const num = Number(v);
                    setDuration(num);
                    setValue("durationMins", num, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger aria-invalid={!!errors.durationMins}>
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
                <FieldError errors={[errors.durationMins]} />
              </Field>

              <Field>
                <FieldLabel>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Price * ({currency})
                  </span>
                </FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                    {currency}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    className="pl-10"
                    aria-invalid={!!errors.price}
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
                <FieldError errors={[errors.price]} />
              </Field>
            </div>

            {/* Buffer */}
            <Field>
              <FieldLabel>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Buffer Time
                </span>
              </FieldLabel>
              <FieldDescription>
                Break time added after this service before next booking
              </FieldDescription>
              <Select
                value={String(buffer)}
                onValueChange={(v) => {
                  const num = Number(v);
                  setBuffer(num);
                  setValue("buffer", num);
                }}
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
              <FieldDescription>
                Shown to customers on the booking page
              </FieldDescription>
              <Textarea
                placeholder="Brief description of this service..."
                className="resize-none h-20 text-sm"
                {...register("description")}
              />
            </Field>

            {/* Active toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
              <div>
                <Label className="text-sm font-medium text-foreground">
                  Active
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inactive services are hidden from the booking page
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(val) => {
                  setIsActive(val);
                  setValue("isActive", val);
                }}
              />
            </div>
          </form>
        </div>

        {/* Fixed footer */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="service-form"
            disabled={isSubmitting}
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Saving..." : "Adding..."}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isEdit ? "Save Changes" : "Add Service"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceFormModal;
