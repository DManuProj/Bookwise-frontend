import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LeaveTableSkeleton = ({
  rows = 8,
  showStaffColumn = true,
}: {
  rows?: number;
  showStaffColumn?: boolean;
}) => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          {showStaffColumn && (
            <TableHead className="w-[220px] pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Staff
            </TableHead>
          )}
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dates
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Duration
          </TableHead>
          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reason
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
            {showStaffColumn && (
              <TableCell className="px-6 py-3.5">
                <Skeleton className="h-3.5 w-32" />
              </TableCell>
            )}
            <TableCell className="space-y-1.5 py-3.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell className="py-3.5">
              <Skeleton className="h-3.5 w-16" />
            </TableCell>
            <TableCell className="py-3.5">
              <Skeleton className="h-3.5 w-40" />
            </TableCell>
            <TableCell className="py-3.5">
              <Skeleton className="h-5 w-20 rounded-full" />
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

export default LeaveTableSkeleton;
