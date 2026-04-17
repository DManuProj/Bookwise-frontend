"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { BUSINESS_TYPES } from "@/lib/countries";
import { Building2, Phone, Upload, X } from "lucide-react";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";

const schema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  phone: z.string().min(7, "Enter a valid phone number"),
  description: z.string().optional(),
  businessType: z.string().min(1, "Please select a business type"),
});

type FormValues = z.infer<typeof schema>;
type SavedData = FormValues & { logo: string | null };

const INITIAL: SavedData = {
  businessName: "John's Salon",
  phone: "+1 555 0100",
  description:
    "A premium hair salon in downtown offering cuts, colour and styling.",
  businessType: "Salon",
  logo: null,
};

const SettingsBusinessInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState<SavedData>(INITIAL);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState(INITIAL.businessType);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      businessName: INITIAL.businessName,
      phone: INITIAL.phone,
      description: INITIAL.description,
      businessType: INITIAL.businessType,
    },
  });

  const watched = watch();
  const isDirty =
    watched.businessName !== saved.businessName ||
    watched.phone !== saved.phone ||
    (watched.description ?? "") !== (saved.description ?? "") ||
    businessType !== saved.businessType ||
    logoPreview !== saved.logo;

  const initials = saved.businessName.slice(0, 2).toUpperCase();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Max 2MB");
      return;
    }
    setLogo(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    reset({
      businessName: saved.businessName,
      phone: saved.phone,
      description: saved.description,
      businessType: saved.businessType,
    });
    setBusinessType(saved.businessType);
    setLogo(null);
    setLogoPreview(saved.logo);
    setIsEditing(false);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: PUT /api/organisation
      await new Promise((res) => setTimeout(res, 800));
      setSaved({ ...values, businessType, logo: logoPreview });
      reset(values);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsCard
      title="Business Info"
      description="Appears on your public booking page"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSubmit(onSubmit)}
    >
      {!isEditing ? (
        /* ── Read-only ── */
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20 overflow-hidden">
              {saved.logo ? (
                <img
                  src={saved.logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-brand-600 dark:text-brand-400">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {saved.businessName}
              </p>
              <p className="text-sm text-muted-foreground">
                {saved.businessType}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              { label: "Phone", value: saved.phone },
              { label: "Description", value: saved.description },
            ].map(
              ({ label, value }) =>
                value && (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm text-foreground">{value}</p>
                  </div>
                ),
            )}
          </div>
        </div>
      ) : (
        /* ── Edit mode ── */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            <div
              className="w-16 h-16 rounded-2xl border-2 border-dashed border-border hover:border-brand-400 transition-colors cursor-pointer flex items-center justify-center shrink-0 overflow-hidden bg-brand-500/5"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-0.5">
                Business Logo
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                PNG, JPG or WebP · Max 2MB
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
                {logo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setLogo(null);
                      setLogoPreview(saved.logo);
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Business Name *</FieldLabel>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  className="pl-9"
                  aria-invalid={!!errors.businessName}
                  {...register("businessName")}
                />
              </div>
              <FieldError errors={[errors.businessName]} />
            </Field>

            <Field>
              <FieldLabel>Business Type *</FieldLabel>
              <Select
                value={businessType}
                onValueChange={(v) => {
                  setBusinessType(v);
                  setValue("businessType", v, { shouldValidate: true });
                }}
              >
                <SelectTrigger aria-invalid={!!errors.businessType}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.businessType]} />
            </Field>
          </div>

          <Field>
            <FieldLabel>Business Phone *</FieldLabel>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="tel"
                className="pl-9"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </div>
            <FieldError errors={[errors.phone]} />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              className="resize-none h-20"
              placeholder="Brief description of your business..."
              {...register("description")}
            />
          </Field>
        </form>
      )}
    </SettingsCard>
  );
};

export default SettingsBusinessInfo;
