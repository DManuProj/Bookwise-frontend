import {
  Calendar,
  UserPlus,
  CalendarOff,
  Shield,
  Wrench,
  LucideIcon,
} from "lucide-react";
import { NotificationType } from "@/types";

export const NOTIFICATION_CONFIG: Record<
  NotificationType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  BOOKING: { icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
  STAFF: { icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-50" },
  LEAVE: { icon: CalendarOff, color: "text-amber-600", bg: "bg-amber-50" },
  ROLE: { icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
  SERVICE: { icon: Wrench, color: "text-slate-600", bg: "bg-slate-100" },
};
