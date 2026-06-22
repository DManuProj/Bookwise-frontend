"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  ShieldCheck,
  User,
  Loader2,
  Send,
  Info,
  UserPlus,
} from "lucide-react";
import type { SendInvitation } from "@/types";

/* ── Schema ── */
const inviteSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  role: z.enum(["ADMIN", "MEMBER"], {
    required_error: "Please select a role",
  }),
});

type FormValues = z.infer<typeof inviteSchema>;
type RoleType = "ADMIN" | "MEMBER";

const roleOptions: {
  value: RoleType;
  label: string;
  subText: string;
  icon: React.ElementType;
  iconClassName: string;
}[] = [
  {
    value: "ADMIN",
    label: "Admin",
    subText: "Can manage bookings, staff and settings",
    icon: ShieldCheck,
    iconClassName: "text-blue-500",
  },
  {
    value: "MEMBER",
    label: "Member",
    subText: "Can view and manage their own bookings",
    icon: User,
    iconClassName: "text-brand-500",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (data: SendInvitation) => void;
  isSubmitting: boolean;
};

const InviteStaffModal = ({ open, onClose, onInvite, isSubmitting }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(inviteSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "MEMBER",
    },
  });

  const role = watch("role");
  const selectedRole = roleOptions.find((item) => item.value === role);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        role: "MEMBER",
      });
    }
  }, [open, reset]);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    onInvite(values);
    // Don't close here — parent closes on mutation success
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md gap-0 overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b border-border px-6 pb-4 pt-6">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
              <UserPlus className="h-4.5 w-4.5" />
            </span>
            Invite Staff
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Send an invitation email to a new team member.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          <form
            id="invite-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>First Name *</FieldLabel>
                <Input
                  placeholder="James"
                  className="h-11 rounded-xl"
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
                <FieldError errors={[errors.firstName]} />
              </Field>
              <Field>
                <FieldLabel>Last Name *</FieldLabel>
                <Input
                  placeholder="Wilson"
                  className="h-11 rounded-xl"
                  aria-invalid={!!errors.lastName}
                  {...register("lastName")}
                />
                <FieldError errors={[errors.lastName]} />
              </Field>
            </div>

            {/* Email */}
            <Field>
              <FieldLabel>Email Address *</FieldLabel>
              <div className="group relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-brand-500" />
                <Input
                  type="email"
                  placeholder="team@example.com"
                  className="h-11 rounded-xl pl-9"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              <FieldError errors={[errors.email]} />
            </Field>

            {/* Role */}
            <Field>
              <FieldLabel>Role *</FieldLabel>
              <Select
                value={role}
                onValueChange={(val: RoleType) =>
                  setValue("role", val, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  aria-invalid={!!errors.role}
                  className="h-11 rounded-xl"
                >
                  <span className="text-sm">
                    {selectedRole ? selectedRole.label : "Select a role"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-start gap-2">
                          <Icon
                            className={`mt-0.5 h-4 w-4 ${option.iconClassName}`}
                          />
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">
                              {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {option.subText}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.role]} />
            </Field>

            <Alert className="border-blue-500/20 bg-blue-500/5 py-3">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-xs leading-relaxed text-muted-foreground">
                The invitee will receive an email with a link to join your
                workspace. The invitation expires in{" "}
                <span className="font-medium text-foreground">48 hours</span>.
              </AlertDescription>
            </Alert>
          </form>
        </div>

        <div className="flex gap-3 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="invite-form"
            disabled={isSubmitting}
            className="h-11 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteStaffModal;
