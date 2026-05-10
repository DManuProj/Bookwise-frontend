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
      <DialogContent className="max-w-sm w-full p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-bold">Edit Role</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Change the role for this team member.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* Member info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={member.photoUrl ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
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
              <SelectTrigger>
                <SelectValue />
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
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-70"
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
