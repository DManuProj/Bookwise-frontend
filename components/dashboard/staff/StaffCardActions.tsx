"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck, UserMinus } from "lucide-react";
import type { StaffMember } from "@/types";

type Props = {
  member: StaffMember;
  onEdit: (member: StaffMember) => void;
  onRemove: (id: string) => void;
};

const StaffCardActions = ({ member, onEdit, onRemove }: Props) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Actions</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44">
      <DropdownMenuItem className="gap-2" onClick={() => onEdit(member)}>
        <ShieldCheck className="h-4 w-4" />
        Edit role
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/8"
        onClick={() => onRemove(member.id)}
      >
        <UserMinus className="h-4 w-4" />
        Remove staff
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default StaffCardActions;
