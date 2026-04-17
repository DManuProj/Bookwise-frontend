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
import { CustomerRow } from "@/types";

type Props = {
  customers: CustomerRow[];
  onView: (customer: CustomerRow) => void;
};

const CustomersTable = ({ customers, onView }: Props) => {
  if (customers.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-b border-border">
          <TableHead className="px-6 text-xs font-medium">Customer</TableHead>
          <TableHead className="text-xs font-medium">Email</TableHead>
          <TableHead className="text-xs font-medium">Phone</TableHead>
          <TableHead className="text-xs font-medium">Bookings</TableHead>
          <TableHead className="text-xs font-medium">Last Visit</TableHead>
          <TableHead className="text-xs font-medium">First Seen</TableHead>
          <TableHead className="text-xs font-medium w-10" />
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
              onClick={() => onView(customer)}
            >
              {/* Name + avatar */}
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

              {/* Email */}
              <TableCell className="py-3">
                <p className="text-sm text-muted-foreground">
                  {customer.email}
                </p>
              </TableCell>

              {/* Phone */}
              <TableCell className="py-3">
                <p className="text-sm text-muted-foreground">
                  {customer.phone}
                </p>
              </TableCell>

              {/* Total bookings */}
              <TableCell className="py-3">
                <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold">
                  {customer.totalBookings}
                </span>
              </TableCell>

              {/* Last visit */}
              <TableCell className="py-3">
                <p className="text-sm text-foreground">{customer.lastVisit}</p>
              </TableCell>

              {/* First seen */}
              <TableCell className="py-3">
                <p className="text-sm text-muted-foreground">
                  {customer.firstSeen}
                </p>
              </TableCell>

              {/* View action */}
              <TableCell className="py-3 pr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(customer);
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
  );
};

export default CustomersTable;
