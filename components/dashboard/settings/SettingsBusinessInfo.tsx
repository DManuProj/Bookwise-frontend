"use client";

import { useState, useRef, useEffect } from "react";
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
import { Building2, MapPin, Phone, Upload, X } from "lucide-react";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useOrganisation,
  useUpdateOrganisation,
} from "@/hooks/api/useOrganisation";

const schema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  phone: z.string().min(7, "Enter a valid phone number"),
  description: z.string().optional(),
  address: z.string().optional(),
  businessType: z.string().min(1, "Please select a business type"),
});

type FormValues = z.infer<typeof schema>;

const SettingsBusinessInfo = () => {
  const { data: org, isLoading } = useOrganisation();

  const { mutate: updateOrg, isPending } = useUpdateOrganisation();

  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState("");
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
      businessName: "",
      phone: "",
      description: "",
      address: "",
      businessType: "",
    },
  });

  //  Sync form with backend data once it loads
  useEffect(() => {
    if (!org) return;
    reset({
      businessName: org.name,
      phone: org.phone ?? "",
      description: org.description ?? "",
      address: org.address ?? "",
      businessType: org.businessType,
    });
    setBusinessType(org.businessType);
    setLogoPreview(org.logo ?? null);
  }, [org, reset]);

  if (isLoading || !org)
    return (
      <SettingsCard
        title="Business Info"
        description="Appears on your public booking page"
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

  const watched = watch();
  const isDirty =
    watched.businessName !== org.name ||
    watched.phone !== (org.phone ?? "") ||
    (watched.description ?? "") !== (org.description ?? "") ||
    (watched.address ?? "") !== (org.address ?? "") ||
    businessType !== (org.businessType ?? "") ||
    logoPreview !== (org.logo ?? null);

  const initials = org.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
      businessName: org.name,
      phone: org.phone ?? "",
      description: org.description ?? "",
      address: org.address ?? "",
      businessType: org.businessType,
    });
    setBusinessType(org.businessType);
    setLogo(null);
    setLogoPreview(org.logo);
    setIsEditing(false);
  };

  const onSubmit = async (values: FormValues) => {
    updateOrg(
      {
        name: values.businessName,
        phone: values.phone,
        description: values.description,
        address: values.address,
        businessType: businessType,
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  return (
    <SettingsCard
      title="Business Info"
      description="Appears on your public booking page"
      isEditing={isEditing}
      isLoading={isLoading}
      isSubmitting={isPending}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSubmit(onSubmit)}
    >
      {!isEditing ? (
        /* ── Read-only ── */
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-500/20 bg-brand-500/10">
              {org.logo ? (
                <img
                  src={org.logo}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-brand-600 dark:text-brand-400">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {org.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {org.businessType}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
            {[
              { label: "Phone", value: org.phone },
              { label: "Description", value: org.description },
              { label: "Address", value: org.address },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>
                <p
                  className={`text-sm ${value ? "text-foreground" : "italic text-muted-foreground"}`}
                >
                  {value ?? "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Edit mode ── */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <div
              className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-brand-500/5 transition-colors hover:border-brand-400"
              onClick={() => fileInputRef.current?.click()}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <p className="mb-0.5 text-sm font-medium text-foreground">
                Business Logo
              </p>
              <p className="mb-2 text-xs text-muted-foreground">
                PNG, JPG or WebP · Max 2MB
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-1 h-3 w-3" />
                  Upload
                </Button>
                {logo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      setLogo(null);
                      setLogoPreview(org.logo);
                    }}
                  >
                    <X className="mr-1 h-3 w-3" />
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Business Name *</FieldLabel>
              <div className="group relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
                <Input
                  className="h-11 rounded-xl pl-9"
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
                <SelectTrigger
                  aria-invalid={!!errors.businessType}
                  className="h-11 rounded-xl"
                >
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
            <div className="group relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
              <Input
                type="tel"
                className="h-11 rounded-xl pl-9"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </div>
            <FieldError errors={[errors.phone]} />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              className="h-20 resize-none rounded-xl"
              placeholder="Brief description of your business..."
              {...register("description")}
            />
          </Field>

          <Field>
            <FieldLabel>Address</FieldLabel>
            <div className="group relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
              <Input
                className="h-11 rounded-xl pl-9"
                placeholder="e.g. 123 Main St, Auckland"
                {...register("address")}
              />
            </div>
          </Field>
        </form>
      )}
    </SettingsCard>
  );
};

export default SettingsBusinessInfo;
