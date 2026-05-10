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
  <div className="rounded-xl border border-border overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40">
          <TableHead className="px-6 font-medium">Customer</TableHead>
          <TableHead className="font-medium">Email</TableHead>
          <TableHead className="font-medium">Phone</TableHead>
          <TableHead className="font-medium">Bookings</TableHead>
          <TableHead className="font-medium">Last Visit</TableHead>
          <TableHead className="font-medium">First Seen</TableHead>
          <TableHead className="font-medium w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }, (_, i) => (
          <TableRow key={i} className="border-b border-border last:border-0">
            <TableCell className="px-6 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-3.5 w-36" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-3.5 w-24" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-6 w-6 rounded-full" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-3.5 w-16" />
            </TableCell>
            <TableCell className="py-3">
              <Skeleton className="h-3.5 w-16" />
            </TableCell>
            <TableCell className="py-3 pr-4">
              <Skeleton className="h-8 w-8 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default CustomersTableSkeleton;
