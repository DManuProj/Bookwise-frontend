"use client";

import { AlertTriangle, ChevronRight } from "lucide-react";
import { useStaleBookingsCount } from "@/hooks/api/useBookings";

interface Props {
  onReview: () => void;
  active: boolean;
}

const BookingsStaleBanner = ({ onReview, active }: Props) => {
  const { data } = useStaleBookingsCount();
  const count = data?.total ?? 0;

  // Hide entirely when there's nothing stale, or when already viewing stale
  if (count === 0 || active) return null;

  return (
    <button
      type="button"
      onClick={onReview}
      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-orange-500/25 bg-orange-500/[0.07] px-4 py-3.5 text-left transition-colors hover:bg-orange-500/[0.12]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400">
          <AlertTriangle className="h-4.5 w-4.5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {count} past {count === 1 ? "booking needs" : "bookings need"}{" "}
            closing
          </p>
          <p className="text-xs text-muted-foreground">
            Mark them complete, no-show, or cancel.
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
        Review
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
};

export default BookingsStaleBanner;
