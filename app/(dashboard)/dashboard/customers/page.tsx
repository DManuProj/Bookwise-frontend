"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import type { BookingStatus, CustomerRow } from "@/types";
import CustomersTable from "@/components/dashboard/customers/CustomersTable";
import CustomersStatsStrip from "@/components/dashboard/customers/CustomersStatsStrip";
import CustomersEmptyState from "@/components/dashboard/customers/CustomersEmptyState";
import CustomerDetailModal from "@/components/dashboard/customers/CustomerDetailModal";

/* ── Types ── */
// export type BookingHistoryItem = {
//   id: string;
//   service: string;
//   date: string;
//   time: string;
//   staff: string;
//   status: BookingStatus;
// };

// export type CustomerRow = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   totalBookings: number;
//   lastVisit: string;
//   firstSeen: string;
//   notes: string;
//   isNew: boolean; // joined this month
//   bookingHistory: BookingHistoryItem[];
// };

/* ── Placeholder data ── */
const CUSTOMERS: CustomerRow[] = [
  {
    id: "c1",
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "+1 555 0101",
    totalBookings: 8,
    lastVisit: "Today",
    firstSeen: "Jan 2024",
    notes: "Prefers Anna for massages.",
    isNew: false,
    bookingHistory: [
      {
        id: "b1",
        service: "Haircut",
        date: "Today",
        time: "9:00 AM",
        staff: "James",
        status: "confirmed",
      },
      {
        id: "b2",
        service: "Swedish Massage",
        date: "Mar 12",
        time: "2:00 PM",
        staff: "Anna",
        status: "completed",
      },
      {
        id: "b3",
        service: "Manicure",
        date: "Feb 20",
        time: "11:00 AM",
        staff: "Anna",
        status: "completed",
      },
    ],
  },
  {
    id: "c2",
    name: "Mike Chen",
    email: "mike@email.com",
    phone: "+1 555 0102",
    totalBookings: 3,
    lastVisit: "Today",
    firstSeen: "Mar 2024",
    notes: "",
    isNew: false,
    bookingHistory: [
      {
        id: "b4",
        service: "Deep Tissue",
        date: "Today",
        time: "10:30 AM",
        staff: "Anna",
        status: "pending",
      },
      {
        id: "b5",
        service: "Beard Trim",
        date: "Feb 14",
        time: "3:00 PM",
        staff: "James",
        status: "completed",
      },
    ],
  },
  {
    id: "c3",
    name: "Emma Williams",
    email: "emma@email.com",
    phone: "+1 555 0103",
    totalBookings: 5,
    lastVisit: "Today",
    firstSeen: "Feb 2024",
    notes: "Allergic to certain nail products.",
    isNew: false,
    bookingHistory: [
      {
        id: "b6",
        service: "Manicure",
        date: "Today",
        time: "11:00 AM",
        staff: "James",
        status: "confirmed",
      },
      {
        id: "b7",
        service: "Facial",
        date: "Mar 5",
        time: "1:00 PM",
        staff: "Anna",
        status: "completed",
      },
    ],
  },
  {
    id: "c4",
    name: "David Brown",
    email: "david@email.com",
    phone: "+1 555 0104",
    totalBookings: 2,
    lastVisit: "Today",
    firstSeen: "Apr 2024",
    notes: "",
    isNew: true,
    bookingHistory: [
      {
        id: "b8",
        service: "Haircut",
        date: "Today",
        time: "2:00 PM",
        staff: "You",
        status: "pending",
      },
    ],
  },
  {
    id: "c5",
    name: "Lisa Anderson",
    email: "lisa@email.com",
    phone: "+1 555 0105",
    totalBookings: 11,
    lastVisit: "Today",
    firstSeen: "Oct 2023",
    notes: "VIP customer. Very punctual.",
    isNew: false,
    bookingHistory: [
      {
        id: "b9",
        service: "Swedish Massage",
        date: "Today",
        time: "3:30 PM",
        staff: "Anna",
        status: "confirmed",
      },
      {
        id: "b10",
        service: "Facial",
        date: "Mar 18",
        time: "10:00 AM",
        staff: "Anna",
        status: "completed",
      },
      {
        id: "b11",
        service: "Manicure",
        date: "Feb 28",
        time: "2:00 PM",
        staff: "James",
        status: "completed",
      },
    ],
  },
  {
    id: "c6",
    name: "Tom Harris",
    email: "tom@email.com",
    phone: "+1 555 0106",
    totalBookings: 4,
    lastVisit: "Tomorrow",
    firstSeen: "Jan 2024",
    notes: "",
    isNew: false,
    bookingHistory: [
      {
        id: "b12",
        service: "Beard Trim",
        date: "Tomorrow",
        time: "9:00 AM",
        staff: "James",
        status: "confirmed",
      },
    ],
  },
  {
    id: "c7",
    name: "Rachel Green",
    email: "rachel@email.com",
    phone: "+1 555 0107",
    totalBookings: 1,
    lastVisit: "Tomorrow",
    firstSeen: "Apr 2024",
    notes: "",
    isNew: true,
    bookingHistory: [
      {
        id: "b13",
        service: "Facial",
        date: "Tomorrow",
        time: "11:30 AM",
        staff: "Anna",
        status: "pending",
      },
    ],
  },
  {
    id: "c8",
    name: "James Miller",
    email: "jmiller@email.com",
    phone: "+1 555 0108",
    totalBookings: 6,
    lastVisit: "Yesterday",
    firstSeen: "Nov 2023",
    notes: "Prefers morning slots.",
    isNew: false,
    bookingHistory: [
      {
        id: "b14",
        service: "Haircut",
        date: "Yesterday",
        time: "2:00 PM",
        staff: "James",
        status: "completed",
      },
      {
        id: "b15",
        service: "Beard Trim",
        date: "Mar 10",
        time: "10:00 AM",
        staff: "James",
        status: "completed",
      },
    ],
  },
  {
    id: "c9",
    name: "Olivia Wilson",
    email: "olivia@email.com",
    phone: "+1 555 0109",
    totalBookings: 3,
    lastVisit: "Yesterday",
    firstSeen: "Feb 2024",
    notes: "",
    isNew: false,
    bookingHistory: [
      {
        id: "b16",
        service: "Deep Tissue Massage",
        date: "Yesterday",
        time: "4:00 PM",
        staff: "Anna",
        status: "no_show",
      },
    ],
  },
  {
    id: "c10",
    name: "Chris Taylor",
    email: "chris@email.com",
    phone: "+1 555 0110",
    totalBookings: 2,
    lastVisit: "Mon 24",
    firstSeen: "Apr 2024",
    notes: "",
    isNew: true,
    bookingHistory: [
      {
        id: "b17",
        service: "Manicure",
        date: "Mon 24",
        time: "10:00 AM",
        staff: "You",
        status: "cancelled",
      },
    ],
  },
];

const PAGE_SIZE = 8;

/* ── Page ── */
const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(
    null,
  );
  const [customers, setCustomers] = useState<CustomerRow[]>(CUSTOMERS);

  /* ── Stats ── */
  const newCount = customers.filter((c) => c.isNew).length;
  const returningCount = customers.filter((c) => !c.isNew).length;

  /* ── Filter ── */
  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
  }, [search, customers]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Save note ── */
  const handleSaveNote = (id: string, note: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes: note } : c)),
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Customers are added automatically when bookings are made.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Stats */}
      {customers.length > 0 && (
        <CustomersStatsStrip
          total={customers.length}
          newThis={newCount}
          returning={returningCount}
        />
      )}

      {/* Table card */}
      <Card className="border-brand-500/20 dark:border-brand-500/10">
        <CardContent className="p-0">
          {paginated.length > 0 ? (
            <CustomersTable
              customers={paginated}
              onView={setSelectedCustomer}
            />
          ) : (
            <CustomersEmptyState />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground px-4">
                Page {page} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Customer detail modal */}
      <CustomerDetailModal
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
        onSaveNote={handleSaveNote}
      />
    </div>
  );
};

export default CustomersPage;
