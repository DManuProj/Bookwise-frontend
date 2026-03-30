import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, TrendingUp, Scissors, Users } from "lucide-react";

const STATS = [
  {
    label: "Today's Bookings",
    value: 8,
    sub: "3 pending confirmation",
    icon: CalendarDays,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    trend: "+2 from yesterday",
  },
  {
    label: "This Month",
    value: 94,
    sub: "total bookings",
    icon: TrendingUp,
    iconBg: "bg-brand-500/10",
    iconColor: "text-brand-500",
    trend: "+12% from last month",
  },
  {
    label: "Active Services",
    value: 6,
    sub: "2 inactive",
    icon: Scissors,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    trend: null,
  },
  {
    label: "Staff Members",
    value: 4,
    sub: "1 invitation pending",
    icon: Users,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    trend: null,
  },
];

const StatsCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {STATS.map((stat) => {
      const Icon = stat.icon;
      return (
        <Card
          key={stat.label}
          className="border border-brand-500/40 dark:border-brand-500/10"
        >
          <CardHeader>
            <div className="flex items-start justify-between ">
              <div
                className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}
              >
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              {stat.trend && (
                <span className="text-sm text-brand-600 dark:text-brand-400 font-medium">
                  {stat.trend}
                </span>
              )}
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

export default StatsCards;
