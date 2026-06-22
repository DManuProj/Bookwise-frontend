"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { User, Phone } from "lucide-react";
import SettingsCard from "@/components/dashboard/settings/SettingsCard";
import { useMe, useUpdateMe } from "@/hooks/api/useMe";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .refine(
      (val) => val === "" || /^[+\d\s\-(). ]+$/.test(val),
      "Phone can only contain digits, spaces, +, -, (, and )",
    )
    .refine(
      (val) => val === "" || val.replace(/\D/g, "").length >= 7,
      "Enter a valid phone number (at least 7 digits)",
    ),
});

type FormValues = z.infer<typeof schema>;

const SettingsProfile = () => {
  const { user } = useUser();
  const { data: me, isLoading } = useMe();
  const { mutate: updateMe, isPending } = useUpdateMe();

  const [isEditing, setIsEditing] = useState(false);

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
  });

  useEffect(() => {
    if (!me) return;
    reset({
      firstName: me?.firstName ?? "",
      lastName: me?.lastName ?? "",
      phone: me?.phone ?? "",
    });
  }, [me, reset]);

  if (isLoading || !me)
    return (
      <SettingsCard
        title="My Profile"
        description="Your personal details and contact info"
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
    watched.firstName !== (me?.firstName ?? "") ||
    watched.lastName !== (me?.lastName ?? "") ||
    watched.phone !== (me.phone ?? "");

  const handleCancel = () => {
    reset({
      firstName: me.firstName ?? "",
      lastName: me.lastName ?? "",
      phone: me.phone ?? "",
    });
    setIsEditing(false);
  };

  const onSubmit = async (values: FormValues) => {
    updateMe(values, {
      onSuccess: () => setIsEditing(false),
    });
  };

  return (
    <SettingsCard
      title="My Profile"
      description="Your personal details and contact info"
      isEditing={isEditing}
      isSubmitting={isPending}
      isDirty={isDirty}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSubmit(onSubmit)}
    >
      {/* Avatar — always visible */}
      <div className="mb-5 flex items-center gap-4 border-b border-border pb-5">
        <Avatar className="h-14 w-14 ring-2 ring-brand-500/15">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? ""} />
          <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-bold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {`${me?.firstName ?? "—"} ${me?.lastName ?? "—"} `}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Photo managed via Clerk account
          </p>
        </div>
      </div>

      {!isEditing ? (
        /* ── Read-only ── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "First Name", value: me?.firstName ?? "—" },
            { label: "Last Name", value: me?.lastName ?? "—" },
            { label: "Phone", value: me.phone ?? "N/A" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>
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
              <div className="group relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
                <Input
                  className="h-11 rounded-xl pl-9"
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
              </div>
              <FieldError errors={[errors.firstName]} />
            </Field>
            <Field>
              <FieldLabel>Last Name *</FieldLabel>
              <Input
                className="h-11 rounded-xl"
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
              />
              <FieldError errors={[errors.lastName]} />
            </Field>
          </div>
          <Field>
            <FieldLabel>Phone</FieldLabel>
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
        </form>
      )}
    </SettingsCard>
  );
};

export default SettingsProfile;
