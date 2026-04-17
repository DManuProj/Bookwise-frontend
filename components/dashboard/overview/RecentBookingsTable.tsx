import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, CheckCircle2, CircleDot, XCircle } from "lucide-react";
import Link from "next/link";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

const STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Pending",
    icon: CircleDot,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-0",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-0",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10   text-red-600   dark:text-red-400   border-0",
  },
  no_show: {
    label: "No Show",
    icon: XCircle,
    className: "bg-rose-500/10  text-rose-600  dark:text-rose-400  border-0",
  },
};

const BOOKINGS = [
  {
    id: "1",
    customer: "Sarah Johnson",
    service: "Haircut",
    date: "Today",
    time: "9:00 AM",
    staff: "James",
    status: "confirmed" as BookingStatus,
  },
  {
    id: "2",
    customer: "Mike Chen",
    service: "Deep Tissue Massage",
    date: "Today",
    time: "10:30 AM",
    staff: "Anna",
    status: "pending" as BookingStatus,
  },
  {
    id: "3",
    customer: "Emma Williams",
    service: "Manicure",
    date: "Today",
    time: "11:00 AM",
    staff: "James",
    status: "confirmed" as BookingStatus,
  },
  {
    id: "4",
    customer: "David Brown",
    service: "Haircut",
    date: "Today",
    time: "2:00 PM",
    staff: "You",
    status: "pending" as BookingStatus,
  },
  {
    id: "5",
    customer: "Lisa Anderson",
    service: "Swedish Massage",
    date: "Today",
    time: "3:30 PM",
    staff: "Anna",
    status: "confirmed" as BookingStatus,
  },
  //   {
  //     id: "6",
  //     customer: "Tom Harris",
  //     service: "Beard Trim",
  //     date: "Tomorrow",
  //     time: "9:00 AM",
  //     staff: "James",
  //     status: "confirmed" as BookingStatus,
  //   },
  //   {
  //     id: "7",
  //     customer: "Rachel Green",
  //     service: "Facial",
  //     date: "Tomorrow",
  //     time: "11:30 AM",
  //     staff: "Anna",
  //     status: "pending" as BookingStatus,
  //   },
];

const RecentBookingsTable = () => (
  <Card className="border border-brand-500/40 dark:border-brand-500/10">
    <CardHeader className="flex flex-row items-center justify-between px-6  border-b border-border">
      <h2 className="text-base font-semibold text-foreground">
        Recent Bookings
      </h2>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-sm text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400"
        asChild
      >
        <Link href="/dashboard/bookings">
          View all <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </Button>
    </CardHeader>
    <CardContent className="-mt-4 p-0">
      <Table>
        <TableHeader className=" ">
          <TableRow className="hover:bg-transparent border-b border-border text-sm ">
            <TableHead className="px-6 text-sm font-bold">Customer</TableHead>
            <TableHead className="text-sm font-bold">Service</TableHead>
            <TableHead className="text-sm font-bold">Date & Time</TableHead>
            <TableHead className="text-sm font-bold">Staff</TableHead>
            <TableHead className="text-sm font-bold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {BOOKINGS.map((booking) => {
            const status = STATUS_CONFIG[booking.status];
            const StatusIcon = status.icon;
            return (
              <TableRow
                key={booking.id}
                className="hover:bg-muted/40 transition-colors border-b border-border last:border-0 cursor-pointer"
              >
                <TableCell className="px-6 py-3">
                  <p className="text-sm font-medium text-foreground">
                    {booking.customer}
                  </p>
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-sm text-muted-foreground">
                    {booking.service}
                  </p>
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-sm font-medium text-foreground">
                    {booking.time}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.date}
                  </p>
                </TableCell>
                <TableCell className="py-3">
                  <p className="text-sm text-muted-foreground">
                    {booking.staff}
                  </p>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    className={`text-xs flex items-center py-3 gap-1 w-fit ${status.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default RecentBookingsTable;
