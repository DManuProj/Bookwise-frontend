"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { StaffFormInputs, staffSchema } from "@/types";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  UserCheck,
  User,
  AlertCircle,
} from "lucide-react";

const staffFormSchema = z
  .object({
    staff: z.array(staffSchema),
  })
  .superRefine((data, ctx) => {
    const emails = data.staff.map((s) => s.email.toLowerCase().trim());
    emails.forEach((email, index) => {
      if (emails.indexOf(email) !== index) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate email address",
          path: ["staff", index, "email"],
        });
      }
    });
  });

type StaffFormValues = z.infer<typeof staffFormSchema>;

/* ── Props ── */
type Props = {
  initialData: StaffFormInputs[];
  onComplete: (staff: StaffFormInputs[]) => void;
  onBack: () => void;
};

/* ── Component ── */
const OnboardingStaff = ({ initialData, onComplete, onBack }: Props) => {
  const { user } = useUser();

  const [addedSelf, setAddedSelf] = useState(
    initialData.some((s) => s.isOwner) ?? false,
  );

  const ownerMember: StaffFormInputs = {
    id: "owner",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    role: "OWNER",
    isOwner: true,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      staff: initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "staff",
  });

  const staffValues = watch("staff");

  /* ── Toggle owner ── */
  const handleAddSelf = () => {
    if (addedSelf) {
      const ownerIndex = fields.findIndex((f) => f.isOwner);
      if (ownerIndex !== -1) remove(ownerIndex);
      setAddedSelf(false);
      return;
    }
    append(ownerMember);
    setAddedSelf(true);
  };

  /* ── Add empty staff ── */
  const handleAdd = () => {
    append({
      id: crypto.randomUUID(),
      firstName: "",
      lastName: "",
      email: "",
      role: "MEMBER",
      isOwner: false,
    });
  };

  /* ── Submit ── */
  const onSubmit = (values: StaffFormValues) => {
    onComplete(values.staff);
  };

  const hasNoStaff = fields.length === 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Add your team
        </h1>
        <p className="text-muted-foreground">
          Staff members will receive an invitation to join your workspace.
        </p>
      </div>

      {/* Add self toggle */}
      <button
        type="button"
        onClick={handleAddSelf}
        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 mb-4 text-left ${
          addedSelf
            ? "border-brand-500 bg-brand-500/5"
            : "border-dashed border-border hover:border-brand-400 hover:bg-brand-500/5"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            addedSelf ? "bg-brand-500" : "bg-muted"
          }`}
        >
          <UserCheck
            className={`h-4 w-4 ${
              addedSelf ? "text-white" : "text-muted-foreground"
            }`}
          />
        </div>
        <div>
          <p
            className={`text-sm font-medium ${
              addedSelf
                ? "text-brand-600 dark:text-brand-400"
                : "text-foreground"
            }`}
          >
            {addedSelf
              ? "You're added as staff ✓"
              : "Add myself as a staff member"}
          </p>
          <p className="text-xs text-muted-foreground">
            {addedSelf
              ? "Click to remove yourself from the team"
              : "Include yourself if you also take bookings"}
          </p>
        </div>
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Staff cards */}
        <div className="space-y-4 mb-4">
          {fields.map((field, index) => {
            const isOwner = field.isOwner;
            return (
              <Card
                key={field.id}
                className="relative border border-brand-500/25 dark:border-none"
              >
                <CardContent className="p-5">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {isOwner ? "Your details" : "Staff member"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <Badge
                          variant="secondary"
                          className="text-xs text-brand-600 dark:text-brand-400 bg-brand-500/10 border-0"
                        >
                          Owner
                        </Badge>
                      )}
                      {!isOwner && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Name */}
                    <Field>
                      <FieldLabel>
                        <Label className="text-xs font-medium text-muted-foreground">
                          First Name *
                        </Label>
                      </FieldLabel>
                      <Input
                        placeholder="James"
                        aria-invalid={!!errors.staff?.[index]?.firstName}
                        {...register(`staff.${index}.firstName`)}
                      />
                      <FieldError
                        errors={
                          errors.staff?.[index]?.firstName
                            ? [
                                {
                                  message:
                                    errors.staff[index].firstName?.message,
                                },
                              ]
                            : []
                        }
                      />
                    </Field>

                    {/* Last Name */}
                    <Field>
                      <FieldLabel>
                        <Label className="text-xs font-medium text-muted-foreground">
                          Last Name *
                        </Label>
                      </FieldLabel>
                      <Input
                        placeholder="Smith"
                        aria-invalid={!!errors.staff?.[index]?.lastName}
                        {...register(`staff.${index}.lastName`)}
                      />
                      <FieldError
                        errors={
                          errors.staff?.[index]?.lastName
                            ? [
                                {
                                  message:
                                    errors.staff[index].lastName?.message,
                                },
                              ]
                            : []
                        }
                      />
                    </Field>

                    {/* Email */}
                    <Field>
                      <FieldLabel>
                        <Label className="text-xs font-medium text-muted-foreground">
                          Email *
                        </Label>
                      </FieldLabel>
                      <Input
                        placeholder="james@example.com"
                        type="email"
                        disabled={isOwner}
                        aria-invalid={!!errors.staff?.[index]?.email}
                        className={isOwner ? "opacity-60" : ""}
                        {...register(`staff.${index}.email`)}
                      />
                      <FieldError
                        errors={
                          errors.staff?.[index]?.email
                            ? [{ message: errors.staff[index].email?.message }]
                            : []
                        }
                      />
                    </Field>

                    {/* Role */}
                    <Field>
                      <FieldLabel>
                        <Label className="text-xs font-medium text-muted-foreground">
                          Role
                        </Label>
                      </FieldLabel>
                      <Select
                        value={staffValues?.[index]?.role ?? "MEMBER"}
                        onValueChange={(val) =>
                          setValue(
                            `staff.${index}.role`,
                            val as "OWNER" | "ADMIN" | "MEMBER",
                            { shouldValidate: true },
                          )
                        }
                        disabled={isOwner}
                      >
                        <SelectTrigger className={isOwner ? "opacity-60" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {isOwner ? (
                            <SelectItem value="OWNER">Owner</SelectItem>
                          ) : (
                            <>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add staff button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          className="w-full border-dashed border-border hover:border-brand-400 hover:bg-brand-500/5 hover:text-brand-600 dark:hover:text-brand-400 text-muted-foreground mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add another staff member
        </Button>

        {/* At least 1 notice */}
        {hasNoStaff && (
          <Alert className="mb-4 bg-amber-500/10 border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-sm text-amber-600 dark:text-amber-400">
              Add at least one staff member to continue. Use the toggle above to
              add yourself.
            </AlertDescription>
          </Alert>
        )}

        {/* Invitation note */}
        <Alert className="mb-6 bg-blue-500/5 border-blue-500/20">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
            Invitation emails will be sent to all staff members after you
            complete setup. They will sign in using Clerk and automatically join
            your workspace.
          </AlertDescription>
        </Alert>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={hasNoStaff}
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingStaff;
