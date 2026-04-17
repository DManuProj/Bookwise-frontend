"use client";

import { useState } from "react";
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
import {
  Field,
  FieldError,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ShieldCheck, User, Loader2, Send, Info } from "lucide-react";

/* ── Schema ── */
const inviteSchema = z.object({
  name: z.string().min(2, "Display name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  role: z.enum(["ADMIN", "MEMBER"], { required_error: "Please select a role" }),
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

/* ── Props ── */
type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (email: string, role: RoleType) => void;
};

const InviteStaffModal = ({ open, onClose, onInvite }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<RoleType>("MEMBER");

  console.log("role", role);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(inviteSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", role: "MEMBER" },
  });

  const selectedRole = roleOptions.find((item) => item.value === role);

  const handleClose = () => {
    reset();
    setRole("MEMBER");
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: POST /api/staff/invite
      await new Promise((res) => setTimeout(res, 900));
      onInvite(values.email, values.role);
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-bold">Invite Staff</DialogTitle>
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
            <Field>
              <FieldLabel>Display Name *</FieldLabel>
              <FieldDescription>
                How this person appears in your dashboard
              </FieldDescription>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="e.g. James"
                  className="pl-9"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </div>
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel>Email Address *</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder="team@example.com"
                  className="pl-9"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              <FieldError errors={[errors.email]} />
            </Field>

            <Field>
              <FieldLabel>Role *</FieldLabel>
              <Select
                value={role}
                onValueChange={(val: RoleType) => {
                  setRole(val);
                  setValue("role", val, { shouldValidate: true });
                }}
              >
                <SelectTrigger aria-invalid={!!errors.role}>
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
                            className={`h-4 w-4 mt-0.5 ${option.iconClassName}`}
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

            <Alert className="bg-blue-500/5 border-blue-500/20 py-3">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-xs text-muted-foreground leading-relaxed">
                The invitee will receive an email with a link to join your
                workspace. The invitation expires in{" "}
                <span className="font-medium text-foreground">48 hours</span>.
              </AlertDescription>
            </Alert>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3">
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
            form="invite-form"
            disabled={isSubmitting}
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-70"
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
