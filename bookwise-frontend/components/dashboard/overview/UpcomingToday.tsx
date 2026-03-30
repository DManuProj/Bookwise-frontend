import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, CircleDot } from "lucide-react";

const UPCOMING = [
  {
    id: "1",
    customer: "Sarah Johnson",
    service: "Haircut",
    time: "9:00 AM",
    staff: "James",
    status: "confirmed" as const,
  },
  {
    id: "2",
    customer: "Mike Chen",
    service: "Deep Tissue",
    time: "10:30 AM",
    staff: "Anna",
    status: "pending" as const,
  },
  {
    id: "3",
    customer: "Emma Williams",
    service: "Manicure",
    time: "11:00 AM",
    staff: "James",
    status: "confirmed" as const,
  },
  {
    id: "4",
    customer: "David Brown",
    service: "Haircut",
    time: "2:00 PM",
    staff: "You",
    status: "pending" as const,
  },
  {
    id: "5",
    customer: "Lisa Anderson",
    service: "Swedish Massage",
    time: "3:30 PM",
    staff: "Anna",
    status: "confirmed" as const,
  },
];

const UpcomingToday = () => (
  <Card className="border border-brand-500/40 dark:border-brand-500/10 ">
    <CardHeader>
      <div className="flex items-center gap-2 mb-0  pb-3 border-b border-border">
        <CalendarDays className="h-4 w-4 text-brand-500" />
        <h2 className="text-base font-semibold text-foreground">
          Upcoming Today
        </h2>
        <Badge className="ml-auto bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0 text-xs">
          {UPCOMING.length} appointments
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="px-5">
      {UPCOMING.length > 0 ? (
        <div className="space-y-0">
          {UPCOMING.map((item, i) => {
            const isConfirmed = item.status === "confirmed";
            const Icon = isConfirmed ? CheckCircle2 : CircleDot;
            const isLast = i === UPCOMING.length - 1;

            return (
              <div key={item.id} className="relative flex gap-3">
                {/* Timeline connector */}
                {!isLast && (
                  <div className="absolute left-[7px] top-4 bottom-0 w-px bg-border" />
                )}

                {/* Status dot */}
                <Icon
                  className={`h-3.5 w-3.5 mt-1 shrink-0 z-10 ${
                    isConfirmed ? "text-brand-500" : "text-amber-500"
                  }`}
                />

                {/* Content */}
                <div className={`flex-1 min-w-0 ${!isLast ? "pb-4" : "pb-1"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.customer}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.service} · {item.staff}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground shrink-0 mt-0.5">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CalendarDays className="h-8 w-8 text-muted-foreground/20 mb-2" />
          <p className="text-sm font-medium text-foreground mb-1">
            All clear today
          </p>
          <p className="text-xs text-muted-foreground">
            No appointments scheduled
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default UpcomingToday;
