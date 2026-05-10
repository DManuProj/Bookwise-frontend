"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Crown,
  ShieldCheck,
  User as UserIcon,
  Phone,
  MailX,
  MoreHorizontal,
  Pencil,
  UserMinus,
  Users,
} from "lucide-react";
import type { User } from "@/types";
import { format } from "date-fns";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

/* ── Role config ── */
const ROLE_CONFIG = {
  OWNER: {
    label: "Owner",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
    icon: Crown,
  },
  ADMIN: {
    label: "Admin",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0",
    icon: ShieldCheck,
  },
  MEMBER: {
    label: "Member",
    className: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
    icon: UserIcon,
  },
};

type Props = {
  users: User[];
  isLoading?: boolean;
  isRemoving?: boolean;
  onEditRole: (user: User) => void;
  onRemove: (id: string) => void;
};

const ActiveMembersTable = ({
  users,
  isLoading = false,
  isRemoving = false,
  onEditRole,
  onRemove,
}: Props) => {
  const [confirmRemove, setConfirmRemove] = useState<User | null>(null);

  return (
    <>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">
          Active Members
        </h2>
        {!isLoading && (
          <span className="text-xs text-muted-foreground">
            ({users.length})
          </span>
        )}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border">
              <TableHead className="pl-5 text-xs font-medium w-[260px]">
                Member
              </TableHead>
              <TableHead className="text-xs font-medium">Phone</TableHead>
              <TableHead className="text-xs font-medium">Role</TableHead>
              <TableHead className="text-xs font-medium">Joined</TableHead>
              <TableHead className="w-[52px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? // Skeleton rows
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-b border-border last:border-0"
                  >
                    <TableCell className="pl-5 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3 w-20" />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))
              : users.map((user) => {
                  const role = ROLE_CONFIG[user.role];
                  const RoleIcon = role.icon;
                  const isOwner = user.role === "OWNER";

                  const initials =
                    `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
                  const joinedAt = user.createdAt
                    ? format(new Date(user.createdAt), "MMM yyyy")
                    : "—";

                  return (
                    <TableRow
                      key={user.id}
                      className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                    >
                      {/* Member */}
                      <TableCell className="pl-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar className="h-9 w-9 ring-2 ring-brand-500/15">
                              <AvatarImage
                                src={user.photoUrl ?? undefined}
                                alt={`${user.firstName} ${user.lastName}`}
                              />
                              <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                                {initials || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-background" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="py-3">
                        {user.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm text-foreground">
                              {user.phone}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <MailX className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                            <span className="text-xs text-muted-foreground/50">
                              Not set
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* Role */}
                      <TableCell className="py-3">
                        <Badge className={`text-xs ${role.className}`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {role.label}
                        </Badge>
                      </TableCell>

                      {/* Joined */}
                      <TableCell className="py-3">
                        <span className="text-sm text-muted-foreground">
                          {joinedAt}
                        </span>
                      </TableCell>

                      {/* Actions — owner has none */}
                      <TableCell className="py-3 pr-4">
                        {!isOwner && (
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
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => onEditRole(user)}
                              >
                                <Pencil className="h-4 w-4" />
                                Edit role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/8"
                                onClick={() => setConfirmRemove(user)}
                              >
                                <UserMinus className="h-4 w-4" />
                                Remove staff
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>

      {/* Confirm remove */}
      <ConfirmationModal
        open={!!confirmRemove}
        onOpenChange={(open) => !open && setConfirmRemove(null)}
        title="Remove Staff"
        description={
          confirmRemove
            ? `${confirmRemove.firstName} ${confirmRemove.lastName} will lose access. Their booking history is preserved.`
            : ""
        }
        confirmLabel="Remove"
        isLoading={isRemoving}
        onConfirm={() => {
          if (confirmRemove) {
            onRemove(confirmRemove.id);
            setConfirmRemove(null);
          }
        }}
      />
    </>
  );
};

export default ActiveMembersTable;
