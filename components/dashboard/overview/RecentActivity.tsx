"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CalendarPlus,
  XCircle,
  CheckCircle2,
  Pencil,
  UserPlus,
  UserCheck,
  Scissors,
  Phone,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { OverviewActivityItem } from "@/types/overview";

// Per-action visual config — icon, tint, headline verb
const ACTION_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    headline: (m: Record<string, unknown>, actor: string | null) => string;
    detail?: (m: Record<string, unknown>) => string | null;
  }
> = {
  BOOKING_CREATED: {
    icon: CalendarPlus,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    headline: (m, actor) =>
      `${actor ?? "Someone"} booked ${m.serviceName ?? "a service"}`,
    detail: (m) => (m.customerName ? `for ${m.customerName}` : null),
  },
  BOOKING_CANCELLED: {
    icon: XCircle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    headline: (m) => `${m.serviceName ?? "Booking"} cancelled`,
    detail: (m) => (m.customerName ? `${m.customerName}` : null),
  },
  BOOKING_COMPLETED: {
    icon: CheckCircle2,
    iconBg: "bg-brand-500/10",
    iconColor: "text-brand-600 dark:text-brand-400",
    headline: (m) => `${m.serviceName ?? "Booking"} completed`,
    detail: (m) => (m.customerName ? `${m.customerName}` : null),
  },
  BOOKING_UPDATED: {
    icon: Pencil,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    headline: (m, actor) => `${actor ?? "Someone"} updated a booking`,
    detail: (m) => {
      const fields = m.changedFields as string[] | undefined;
      return fields?.length ? `Changed: ${fields.join(", ")}` : null;
    },
  },
  CUSTOMER_CREATED: {
    icon: UserPlus,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
    headline: (m) => `New customer — ${m.customerName ?? "Unknown"}`,
    detail: () => null,
  },
  STAFF_INVITED: {
    icon: UserPlus,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    headline: (m, actor) => `${actor ?? "Someone"} invited a teammate`,
    detail: (m) => (m.email as string) ?? null,
  },
  STAFF_JOINED: {
    icon: UserCheck,
    iconBg: "bg-brand-500/10",
    iconColor: "text-brand-600 dark:text-brand-400",
    headline: (_, actor) => `${actor ?? "Someone"} joined the team`,
    detail: () => null,
  },
  SERVICE_CREATED: {
    icon: Scissors,
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    headline: (m, actor) =>
      `${actor ?? "Someone"} added ${m.serviceName ?? "a service"}`,
    detail: () => null,
  },
};

// Fallback for unknown actions
const DEFAULT_CONFIG = {
  icon: Activity,
  iconBg: "bg-muted",
  iconColor: "text-muted-foreground",
  headline: (_: unknown, actor: string | null) =>
    actor ? `${actor} performed an action` : "Activity",
  detail: () => null,
};

const RecentActivity = ({ items }: { items: OverviewActivityItem[] }) => (
  <Card className="border border-brand-500/40 dark:border-brand-500/10">
    <CardHeader className="flex flex-row items-center gap-2 px-6 pb-3 border-b border-border">
      <Activity className="h-4 w-4 text-brand-500" />
      <h2 className="text-base font-semibold text-foreground">
        Recent Activity
      </h2>
      <Badge className="ml-auto bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0 text-xs">
        {items.length} event{items.length === 1 ? "" : "s"}
      </Badge>
    </CardHeader>

    <CardContent className="p-0">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Activity className="h-8 w-8 text-muted-foreground/20 mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">
            No activity yet
          </p>
          <p className="text-xs text-muted-foreground">
            Bookings and team changes will appear here
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const config = ACTION_CONFIG[item.action] ?? DEFAULT_CONFIG;
            const Icon = config.icon;
            const metadata = (item.metadata ?? {}) as Record<string, unknown>;
            const headline = config.headline(metadata, item.actorName);
            const detail = config.detail?.(metadata);
            const isVoiceAi = metadata.source === "VOICE_AI";

            return (
              <li
                key={item.id}
                className="flex items-start gap-3 px-6 py-3.5 hover:bg-muted/30 transition-colors"
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-full ${config.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`h-4 w-4 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">
                      {headline}
                    </p>
                    {isVoiceAi && (
                      <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-0 text-[10px] h-4 px-1.5 gap-1">
                        <Phone className="h-2.5 w-2.5" />
                        Voice AI
                      </Badge>
                    )}
                  </div>
                  {detail && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {detail}
                    </p>
                  )}
                </div>

                {/* Timestamp */}
                <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                  {formatDistanceToNow(parseISO(item.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </CardContent>
  </Card>
);

export default RecentActivity;
