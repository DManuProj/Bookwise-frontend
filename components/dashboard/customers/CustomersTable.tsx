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
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="px-6 font-medium">Customer</TableHead>
            <TableHead className="font-medium">Email</TableHead>
            <TableHead className="font-medium">Phone</TableHead>
            <TableHead className="font-medium">Bookings</TableHead>
            <TableHead className="font-medium">Last Visit</TableHead>
            <TableHead className="font-medium w-10" />
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
                className="hover:bg-muted/40 transition-colors border-b border-border last:border-0 cursor-pointer"
                onClick={() => onView(customer.id)}
              >
                <TableCell className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-foreground">
                      {customer.name}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </TableCell>

                <TableCell className="py-3">
                  <p className="text-sm text-muted-foreground">
                    {customer.phone}
                  </p>
                </TableCell>

                <TableCell className="py-3">
                  <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                    {customer.totalBookings}
                  </span>
                </TableCell>

                <TableCell className="py-3">
                  <p className="text-sm text-foreground">
                    {formatLastVisit(customer.lastVisit)}
                  </p>
                </TableCell>

                <TableCell className="py-3 pr-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(customer.id);
                    }}
                  >
                    <Eye className="h-4 w-4" />
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
