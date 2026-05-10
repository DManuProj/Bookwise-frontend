import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BookingsTableSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <div className="rounded-xl border border-border overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead className="w-[280px] pl-6 font-medium">Customer</TableHead>
          <TableHead className="font-medium">Service</TableHead>
          <TableHead className="font-medium">Date &amp; Time</TableHead>
          <TableHead className="font-medium">Staff</TableHead>
          <TableHead className="font-medium">Source</TableHead>
          <TableHead className="font-medium">Status</TableHead>
          <TableHead className="font-medium w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, i) => (
          <TableRow key={i} className="border-b border-border last:border-0">
            {/* Customer */}
            <TableCell className="px-6 py-3 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-24" />
            </TableCell>

            {/* Service */}
            <TableCell className="py-3 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-12" />
            </TableCell>

            {/* Date & Time */}
            <TableCell className="py-3 space-y-1.5">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3 w-20" />
            </TableCell>

            {/* Staff */}
            <TableCell className="py-3">
              <Skeleton className="h-3.5 w-24" />
            </TableCell>

            {/* Source */}
            <TableCell className="py-3">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3.5 w-14" />
              </div>
            </TableCell>

            {/* Status */}
            <TableCell className="py-3">
              <Skeleton className="h-5 w-20 rounded-full" />
            </TableCell>

            {/* Actions */}
            <TableCell className="py-3 pr-4">
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default BookingsTableSkeleton;
