"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  COUNTRIES,
  BUSINESS_TYPES,
  getCountryByCode,
  CURRENCIES,
} from "@/lib/countries";
import { businessFormSchema } from "@/types";
import type { BusinessFormInputs, Step1Data, SlugStatus } from "@/types";
import {
  Building2,
  Globe,
  Phone,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Upload,
  X,
} from "lucide-react";

/* ── Slug helper ── */
const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 30);

/* ── Types ── */
type Props = {
  initialData: Step1Data | null;
  onComplete: (data: Step1Data) => void;
};

const OnboardingBusinessInfo = ({ initialData, onComplete }: Props) => {
  const [logo, setLogo] = useState<File | null>(initialData?.logo ?? null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [currency, setCurrency] = useState(initialData?.currency ?? "");
  const [businessType, setBusinessType] = useState(
    initialData?.businessType ?? "",
  );
  const [country, setCountry] = useState(initialData?.country ?? "");

  const slugDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BusinessFormInputs>({
    resolver: zodResolver(businessFormSchema),
    mode: "onTouched", // ← validates on blur
    reValidateMode: "onChange",
    defaultValues: {
      businessName: initialData?.businessName ?? "",
      slug: initialData?.slug ?? "",
      businessType: initialData?.businessType ?? "",
      phone: initialData?.phone ?? "",
      description: initialData?.description ?? "",
      country: initialData?.country ?? "",
      currency: initialData?.currency ?? "",
    },
  });

  const businessName = watch("businessName");
  const slug = watch("slug");

  /* ── Auto-generate slug from business name ── */
  useEffect(() => {
    if (!initialData?.slug) {
      const generated = toSlug(businessName);
      setValue("slug", generated, { shouldValidate: !!generated });
    }
  }, [businessName]);

  /* ── Slug availability check (debounced 500ms) ── */
  useEffect(() => {
    if (!slug || slug.length < 3) {
      setSlugStatus("idle");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setSlugStatus("invalid");
      return;
    }

    setSlugStatus("checking");
    if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current);

    slugDebounceRef.current = setTimeout(async () => {
      // TODO: replace with real API call
      // const res = await fetch(`/api/slug/check?slug=${slug}`)
      // const { available } = await res.json()
      await new Promise((res) => setTimeout(res, 600));
      const taken = ["demo", "test", "admin", "bookwise"].includes(slug);
      setSlugStatus(taken ? "taken" : "available");
    }, 500);

    return () => {
      if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current);
    };
  }, [slug]);

  /* ── Country → timezone + currency ── */
  // useEffect(() => {
  //   const found = getCountryByCode(country);
  //   if (found) {
  //     setValue("timezone", found.timezone, { shouldValidate: true });
  //     setValue("currency", `${found.currency} (${found.currencySymbol})`, {
  //       shouldValidate: true,
  //     });
  //   }
  // }, [country]);

  /* ── Logo upload ── */
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo must be under 2MB");
      return;
    }
    setLogo(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Submit ── */
  const onSubmit = (values: BusinessFormInputs) => {
    if (slugStatus === "taken" || slugStatus === "checking") return;
    onComplete({ ...values, logo });
  };

  const initials = businessName
    ? businessName.trim().slice(0, 2).toUpperCase()
    : "BW";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Tell us about your business
        </h1>
        <p className="text-muted-foreground">
          This information will appear on your public booking page.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ── Logo ── */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-5">
              {/* Preview */}
              <div
                className="w-50 h-50 rounded-2xl flex items-center justify-center shrink-0 border-2 border-dashed border-border cursor-pointer hover:border-brand-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-500/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                      {initials}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Business Logo
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  PNG, JPG or WebP · Max 2MB · Optional
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-3 w-3 mr-1.5" />
                    Upload Logo
                  </Button>
                  {logo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-destructive"
                      onClick={removeLogo}
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
          </CardContent>
        </Card>

        {/* ── Business name ── */}
        <Field>
          <FieldLabel>Business Name *</FieldLabel>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="e.g. John's Salon"
              className="pl-10"
              aria-invalid={!!errors.businessName}
              {...register("businessName")}
            />
          </div>
          <FieldError errors={[errors.businessName]} />
        </Field>

        {/* ── Slug ── */}
        <Field>
          <FieldLabel>Booking Page URL *</FieldLabel>
          <div
            className={`flex items-center border rounded-md overflow-hidden focus-visible:border-brand-500!! ${errors.slug ? "border-destructive" : "border-input"}`}
          >
            <span className="px-3 py-2 bg-muted text-muted-foreground  text-sm border-r border-input whitespace-nowrap h-11 flex items-center">
              bookwise.ai/book/
            </span>
            <input
              className="flex-1 px-3 h-11 text-sm bg-background text-foreground outline-none"
              placeholder="johns-salon"
              {...register("slug")}
              onChange={(e) =>
                setValue("slug", toSlug(e.target.value), {
                  shouldValidate: true,
                })
              }
            />
            <div className="px-3">
              {slugStatus === "checking" && (
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              )}
              {slugStatus === "available" && (
                <CheckCircle2 className="h-4 w-4 text-brand-500" />
              )}
              {(slugStatus === "taken" || slugStatus === "invalid") && (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          </div>
          <FieldError errors={[errors.slug]} />
          {slugStatus === "available" && (
            <p className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3" /> This URL is available
            </p>
          )}
          {slugStatus === "taken" && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <XCircle className="h-3 w-3" /> This URL is already taken
            </p>
          )}
        </Field>

        {/* ── Business type ── */}
        <Field>
          <FieldLabel>Business Type *</FieldLabel>
          <Select
            value={businessType}
            onValueChange={(val) => {
              setBusinessType(val);
              setValue("businessType", val, { shouldValidate: true });
            }}
          >
            <SelectTrigger aria-invalid={!!errors.businessType}>
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.businessType]} />
        </Field>

        {/* ── Phone ── */}
        <Field>
          <FieldLabel>Business Phone *</FieldLabel>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="+1 555 000 0000"
              type="tel"
              className="pl-10"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
          </div>
          <FieldError errors={[errors.phone]} />
        </Field>

        {/* ── Description ── */}
        <Field>
          <FieldLabel>Business Description</FieldLabel>
          <FieldDescription>
            Optional - used by your AI receptionist
          </FieldDescription>
          <Textarea
            placeholder="e.g. A premium hair salon in downtown offering cuts, colour and styling."
            className="resize-none h-24"
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>

        {/* ── Country ── */}
        <Field>
          <FieldLabel>Country *</FieldLabel>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
            <Select
              value={country}
              onValueChange={(val) => {
                setCountry(val);
                setValue("country", val, { shouldValidate: true });
                // Auto-set currency from country
                const found = getCountryByCode(val);
                if (found) {
                  setValue("currency", found.currency, {
                    shouldValidate: true,
                  });
                  setCurrency(found.currency);
                }
              }}
            >
              <SelectTrigger aria-invalid={!!errors.country}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FieldError errors={[errors.country]} />
        </Field>

        {/* ── Currency ── */}
        <Field>
          <FieldLabel>Currency *</FieldLabel>
          <Select
            value={currency}
            onValueChange={(val) => {
              setCurrency(val);
              setValue("currency", val, { shouldValidate: true });
            }}
          >
            <SelectTrigger aria-invalid={!!errors.currency}>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} — {c.name} ({c.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.currency]} />
        </Field>

        {/* ── Submit ── */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={slugStatus === "checking" || slugStatus === "taken"}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {slugStatus === "taken" && (
            <p className="text-xs text-center text-destructive mt-2">
              Please choose a different URL before continuing
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default OnboardingBusinessInfo;
