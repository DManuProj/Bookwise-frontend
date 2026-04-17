"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { User, Phone } from "lucide-react";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

type FormValues = z.infer<typeof schema>;

const SettingsProfile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedPhone, setSavedPhone] = useState("+1 555 0100");

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: savedPhone,
    },
  });

  const watched = watch();
  const isDirty =
    watched.firstName !== (user?.firstName ?? "") ||
    watched.lastName !== (user?.lastName ?? "") ||
    watched.phone !== savedPhone;

  const handleCancel = () => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phone: savedPhone,
    });
    setIsEditing(false);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: PUT /api/me
      await new Promise((res) => setTimeout(res, 800));
      setSavedPhone(values.phone);
      reset(values);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsCard
      title="My Profile"
      description="Your personal details and contact info"
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSubmit(onSubmit)}
    >
      {/* Avatar — always visible */}
      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
        <Avatar className="h-14 w-14 ring-2 ring-brand-500/15">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? ""} />
          <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {user?.fullName ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Photo managed via Clerk account
          </p>
        </div>
      </div>

      {!isEditing ? (
        /* ── Read-only ── */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "First Name", value: user?.firstName ?? "—" },
            { label: "Last Name", value: user?.lastName ?? "—" },
            { label: "Phone", value: savedPhone },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        /* ── Edit mode ── */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>First Name *</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
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
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
              />
              <FieldError errors={[errors.lastName]} />
            </Field>
          </div>
          <Field>
            <FieldLabel>Phone *</FieldLabel>
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
        </form>
      )}
    </SettingsCard>
  );
};

export default SettingsProfile;
