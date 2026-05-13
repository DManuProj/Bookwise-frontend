"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, TrendingUp, Scissors, Users } from "lucide-react";
import { format } from "date-fns";
import { OverviewStats } from "@/types/overview";

const StatsCards = ({ stats }: { stats: OverviewStats }) => {
  const now = new Date();
  const todayLabel = format(now, "EEE, d MMM"); // "Mon, 11 May"
  const monthLabel = format(now, "MMM yyyy"); // "May 2026"

  const totalServices = stats.services.active + stats.services.inactive;

  const cards = [
    {
      label: "Today's Bookings",
      value: stats.todayBookings.total,
      sub: `${stats.todayBookings.pending} pending confirmation`,
      icon: CalendarDays,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      badge: todayLabel,
    },
    {
      label: "This Month",
      value: stats.monthBookings.total,
      sub: "total bookings",
      icon: TrendingUp,
      iconBg: "bg-brand-500/10",
      iconColor: "text-brand-500",
      badge: monthLabel,
    },
    {
      label: "Active Services",
      value: stats.services.active,
      sub: `${stats.services.inactive} inactive`,
      icon: Scissors,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      badge: `${stats.services.active} of ${totalServices} total`,
    },
    {
      label: "Staff Members",
      value: stats.staff.total,
      sub:
        stats.staff.pendingInvitations === 0
          ? "no invitations pending"
          : `${stats.staff.pendingInvitations} invitation${
              stats.staff.pendingInvitations === 1 ? "" : "s"
            } pending`,
      icon: Users,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      badge: `${stats.staff.total} active`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="border border-brand-500/40 dark:border-brand-500/10"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.badge}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-foreground mb-0.5">
                    {stat.label}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {stat.sub}
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
