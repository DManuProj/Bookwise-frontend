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
  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="w-[280px] pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Customer
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Service
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date &amp; Time
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Staff
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Source
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, i) => (
          <TableRow key={i} className="border-b border-border last:border-0">
            {/* Customer */}
            <TableCell className="space-y-1.5 px-6 py-3.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-24" />
            </TableCell>

            {/* Service */}
            <TableCell className="space-y-1.5 py-3.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-12" />
            </TableCell>

            {/* Date & Time */}
            <TableCell className="space-y-1.5 py-3.5">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3 w-20" />
            </TableCell>

            {/* Staff */}
            <TableCell className="py-3.5">
              <Skeleton className="h-3.5 w-24" />
            </TableCell>

            {/* Source */}
            <TableCell className="py-3.5">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-3.5 w-14" />
              </div>
            </TableCell>

            {/* Status */}
            <TableCell className="py-3.5">
              <Skeleton className="h-5 w-20 rounded-full" />
            </TableCell>

            {/* Actions */}
            <TableCell className="py-3.5 pr-4">
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default BookingsTableSkeleton;
