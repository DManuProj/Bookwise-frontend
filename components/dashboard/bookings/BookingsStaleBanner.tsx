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
      className="w-full flex items-center justify-between gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors px-4 py-3 text-left"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/15">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {count} past {count === 1 ? "booking needs" : "bookings need"}{" "}
            closing
          </p>
          <p className="text-xs text-muted-foreground">
            Mark them complete, no-show, or cancel.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400">
        Review
        <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
};

export default BookingsStaleBanner;
