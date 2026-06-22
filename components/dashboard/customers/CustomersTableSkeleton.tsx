import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CustomersTableSkeleton = ({ rows = 8 }: { rows?: number }) => (
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
        {Array.from({ length: rows }, (_, i) => (
          <TableRow key={i} className="border-b border-border last:border-0">
            <TableCell className="px-6 py-3.5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            </TableCell>
            <TableCell className="py-3.5">
              <Skeleton className="h-3.5 w-36" />
            </TableCell>
            <TableCell className="py-3.5">
              <Skeleton className="h-3.5 w-24" />
            </TableCell>
            <TableCell className="py-3.5">
              <Skeleton className="h-6 w-8 rounded-full" />
            </TableCell>
            <TableCell className="py-3.5">
              <Skeleton className="h-3.5 w-16" />
            </TableCell>
            <TableCell className="py-3.5 pr-4">
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default CustomersTableSkeleton;
