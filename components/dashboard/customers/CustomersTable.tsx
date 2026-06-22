"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import type { CustomerListRow } from "@/types";

type Props = {
  customers: CustomerListRow[];
  onView: (id: string) => void;
};

const formatLastVisit = (iso: string | null) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
};

const CustomersTable = ({ customers, onView }: Props) => {
  if (customers.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customer
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Phone
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bookings
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Last Visit
            </TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => {
            const initials = customer.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <TableRow
                key={customer.id}
                className="group cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                onClick={() => onView(customer.id)}
              >
                <TableCell className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0 ring-2 ring-brand-500/15">
                      <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-semibold text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-foreground">
                      {customer.name}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="py-3.5">
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </TableCell>

                <TableCell className="py-3.5">
                  <p className="text-sm text-muted-foreground">
                    {customer.phone}
                  </p>
                </TableCell>

                <TableCell className="py-3.5">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-500/10 px-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {customer.totalBookings}
                  </span>
                </TableCell>

                <TableCell className="py-3.5">
                  <p className="text-sm text-foreground">
                    {formatLastVisit(customer.lastVisit)}
                  </p>
                </TableCell>

                <TableCell className="py-3.5 pr-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg border border-transparent text-muted-foreground opacity-0 transition-all hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-600 group-hover:opacity-100 focus-visible:opacity-100 dark:hover:text-brand-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(customer.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View customer</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomersTable;
