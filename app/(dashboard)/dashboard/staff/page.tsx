"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import type { StaffMember } from "@/types";
import StaffTable from "@/components/dashboard/staff/StaffTable";
import StaffStatsStrip from "@/components/dashboard/staff/StaffStatsStrip";
import StaffEmptyState from "@/components/dashboard/staff/StaffEmptyState";
import InviteStaffModal from "@/components/dashboard/staff/InviteStaffModal";
import EditRoleModal from "@/components/dashboard/staff/EditRoleModal";

/* ── Placeholder data ── */
const INITIAL_STAFF: StaffMember[] = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "alex@bookwise.ai",
    role: "OWNER",
    status: "active",
    isOwner: true,
    phone: "+1 555 0100",
    joinedAt: "Jan 2024",
  },
  {
    id: "u2",
    name: "James Wilson",
    email: "james@bookwise.ai",
    role: "ADMIN",
    status: "active",
    isOwner: false,
    phone: "+1 555 0101",
    joinedAt: "Feb 2024",
  },
  {
    id: "u3",
    name: "Anna Chen",
    email: "anna@bookwise.ai",
    role: "MEMBER",
    status: "active",
    isOwner: false,
    phone: "+1 555 0102",
    joinedAt: "Mar 2024",
  },
  {
    id: "u4",
    name: "",
    email: "mike@example.com",
    role: "MEMBER",
    status: "inactive",
    isOwner: false,
    joinedAt: undefined,
  },
];

/* ── Page ── */
const StaffPage = () => {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editMember, setEditMember] = useState<StaffMember | null>(null);
  const [editRoleOpen, setEditRoleOpen] = useState(false);

  /* ── Stats ── */
  const active = staff.filter((s) => s.status === "active").length;
  const pending = staff.filter((s) => s.status === "inactive").length;

  /* ── Handlers ── */
  const handleInvite = (email: string, role: "ADMIN" | "MEMBER") => {
    const newMember: StaffMember = {
      id: crypto.randomUUID(),
      name: "",
      email,
      role,
      status: "inactive",
      isOwner: false,
    };
    setStaff((prev) => [...prev, newMember]);
  };

  const handleEditRole = (member: StaffMember) => {
    setEditMember(member);
    setEditRoleOpen(true);
  };

  const handleResend = (id: string) => {
    // TODO: POST /api/staff/invite/resend
    console.log("Resend invite for:", id);
  };

  const handleSaveRole = (id: string, role: "ADMIN" | "MEMBER") => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));
  };

  const handleRemove = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team and their roles.
          </p>
        </div>
        <Button
          onClick={() => setInviteOpen(true)}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg h-11 shadow-sm shadow-brand-500/20"
        >
          <UserPlus className="h-4 w-4 " />
          Invite Staff
        </Button>
      </div>

      {/* Stats */}
      {staff.length > 0 && (
        <StaffStatsStrip
          total={staff.length}
          active={active}
          pending={pending}
        />
      )}

      {/* Table or empty */}
      {staff.length > 0 ? (
        <StaffTable
          staff={staff}
          onEdit={handleEditRole}
          onRemove={handleRemove}
          onResend={handleResend}
        />
      ) : (
        <StaffEmptyState onInvite={() => setInviteOpen(true)} />
      )}

      {/* Invite modal */}
      <InviteStaffModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInvite}
      />

      {/* Edit role modal */}
      <EditRoleModal
        open={editRoleOpen}
        onClose={() => {
          setEditRoleOpen(false);
          setEditMember(null);
        }}
        member={editMember}
        onSave={handleSaveRole}
      />
    </div>
  );
};

export default StaffPage;
