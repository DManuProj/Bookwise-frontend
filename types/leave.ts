// Mirrors backend Prisma enum

import { LeaveStatus } from "@/types/enums";

// Single leave record — shape returned by GET /api/leave
// Backend includes user.firstName + user.lastName
export type Leave = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: LeaveStatus;
  userId: string;
  orgId: string;
  approverId: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

// POST /api/leave payload
// date strings YYYY-MM-DD — backend builds org-TZ day boundaries
export type LeaveRequestPayload = {
  startDate: string;
  endDate: string;
  reason?: string;
};

// PUT /api/leave/:id payload
export type LeaveStatusUpdatePayload = {
  id: string;
  status: "APPROVED" | "REJECTED";
};

// Filters for the list view
// userId is admin-only on the backend — staff filter is ignored for them
export type LeaveFilters = {
  status?: LeaveStatus;
  userId?: string;
};
