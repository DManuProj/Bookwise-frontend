import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceCardSkeleton = () => (
  <Card className="border border-brand-500/35 dark:border-brand-500/10">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </CardHeader>
    <CardContent className="px-5 space-y-4">
      <Skeleton className="h-7 w-24" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-20" />
      </div>
    </CardContent>
  </Card>
);

const ServicesGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }, (_, i) => (
      <ServiceCardSkeleton key={i} />
    ))}
  </div>
);

export default ServicesGridSkeleton;
