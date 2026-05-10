"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  User,
  Phone,
  Mail,
  Upload,
  X,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateMe } from "@/hooks/api/useUpdateMe";
import { useMe } from "@/hooks/api/useMe";

/* ── Schema ── */
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

type FormValues = z.infer<typeof schema>;

/* ── Component ── */
const ProfileSetupForm = () => {
  // 1. ALL hooks
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { mutate: submitUser, isPending } = useUpdateMe();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  // 2. Sync form when user data arrives
  useEffect(() => {
    if (!user) return;
    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: "",
    });
  }, [user, reset]);

  // 3. Derived values
  const initials =
    [user?.firstName?.[0], user?.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "U";

  // 4. Handlers
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Photo must be under 2MB");
      return;
    }
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    submitUser(values, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  // 5. Early return — AFTER all hooks
  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden border-border bg-card p-0 gap-0 rounded-2xl shadow-sm">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-brand-400" />
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <Skeleton className="w-12 h-12 rounded-2xl mb-4" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Photo */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-border">
            <Skeleton className="h-20 w-20 rounded-full mb-3" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-40 mt-2" />
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl mt-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // 6. JSX
  return (
    <Card className="w-full overflow-hidden border-border bg-card p-0 gap-0 rounded-2xl shadow-sm">
      {/* Gradient accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-brand-400" />

      <CardContent className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Complete your profile
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Just a few details before you get started. This only takes 30
            seconds.
          </p>
        </div>

        {/* Photo upload */}
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-border">
          <div className="relative group mb-3">
            <Avatar
              className="h-20 w-20 ring-2 ring-brand-500/20 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <AvatarImage src={photoPreview} alt="Profile photo" />
              ) : (
                <AvatarImage
                  src={user?.photoUrl || ""}
                  alt={user?.firstName ?? ""}
                />
              )}
              <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Overlay on hover */}
            <div
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-7 rounded-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3 w-3 mr-1.5" />
              Upload photo
            </Button>
            {photo && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-7 rounded-lg text-muted-foreground hover:text-destructive"
                onClick={() => {
                  setPhoto(null);
                  setPhotoPreview(null);
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Optional · PNG, JPG or WebP · Max 2MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First + last name */}
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>First Name *</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Sarah"
                  className="pl-9"
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
              </div>
              <FieldError errors={[errors.firstName]} />
            </Field>

            <Field>
              <FieldLabel>Last Name *</FieldLabel>
              <Input
                placeholder="Johnson"
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
              />
              <FieldError errors={[errors.lastName]} />
            </Field>
          </div>

          {/* Phone */}
          <Field>
            <FieldLabel>Phone Number *</FieldLabel>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="tel"
                placeholder="+1 555 0100"
                className="pl-9"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </div>
            <FieldError errors={[errors.phone]} />
          </Field>

          {/* Email — read only */}
          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="pl-9 opacity-60 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Managed via your account — cannot be changed here.
            </p>
          </Field>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl h-11 shadow-sm shadow-brand-500/20 font-semibold mt-2 disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up your profile...
              </>
            ) : (
              <>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-5">
          You can update your profile anytime from{" "}
          <span className="font-medium text-foreground">
            Dashboard → Settings
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileSetupForm;
