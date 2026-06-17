"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import BookingFlow from "@/components/booking/BookingFlow";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicOrg } from "@/hooks/api/usePublicBooking";

const BookingPageSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
      {/* Left panel */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-5" />
        <Skeleton className="h-3 w-40 mb-2" />
        <Skeleton className="h-3 w-28" />
      </div>

      {/* Right panel */}
      <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
        <Skeleton className="h-2 w-full rounded-full mb-8" />
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-56 mb-6" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const BookingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: org, isPending, isError } = usePublicOrg(slug);

  if (isPending) return <BookingPageSkeleton />;
  if (isError || !org) return notFound();

  return <BookingFlow org={org} />;
};

export default BookingPage;
