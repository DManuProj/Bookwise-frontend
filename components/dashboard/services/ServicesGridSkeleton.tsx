import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceCardSkeleton = () => (
  <Card className="gap-0 overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-sm">
    <CardHeader className="p-5 pb-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4 p-5 pt-4">
      <Skeleton className="h-7 w-24" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

const ServicesGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }, (_, i) => (
      <ServiceCardSkeleton key={i} />
    ))}
  </div>
);

export default ServicesGridSkeleton;
