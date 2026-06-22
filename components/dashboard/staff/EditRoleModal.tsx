"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShieldCheck,
  User as UserIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { User } from "@/types";

type Props = {
  open: boolean;
  onClose: () => void;
  member: User | null;
  onSave: (id: string, role: "ADMIN" | "MEMBER") => void;
  isSubmitting: boolean;
};

const EditRoleModal = ({
  open,
  onClose,
  member,
  onSave,
  isSubmitting,
}: Props) => {
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");

  /* ── Sync role when member changes ── */
  useEffect(() => {
    if (member && member.role !== "OWNER") {
      setRole(member.role as "ADMIN" | "MEMBER");
    }
  }, [member]);

  if (!member) return null;

  const initials =
    `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();
  const fullName = `${member.firstName} ${member.lastName}`.trim();

  const handleSave = () => {
    onSave(member.id, role);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm gap-0 overflow-hidden rounded-2xl p-0">
        {/* Header */}
        <DialogHeader className="border-b border-border px-6 pb-4 pt-6">
          <DialogTitle className="text-lg font-bold tracking-tight">
            Edit Role
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Change the role for this team member.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4 px-6 py-5">
          {/* Member info */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-brand-500/15">
              <AvatarImage src={member.photoUrl ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>
          </div>

          {/* Role select */}
          <Field>
            <FieldLabel>Role</FieldLabel>
            <Select
              value={role}
              onValueChange={(val: "ADMIN" | "MEMBER") => setRole(val)}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue className="flex-1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Admin</p>
                      <p className="text-xs text-muted-foreground">
                        Can manage bookings, staff and settings
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="MEMBER">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-brand-500" />
                    <div>
                      <p className="text-sm font-medium">Member</p>
                      <p className="text-xs text-muted-foreground">
                        Can view and manage their own bookings
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="h-11 flex-1 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save Role
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleModal;
