import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  hasFilters: boolean;
  onClear: () => void;
};

const BookingsEmptyState = ({ hasFilters, onClear }: Props) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
      <CalendarDays className="h-7 w-7" />
    </div>
    <p className="mb-1 text-base font-bold tracking-tight text-foreground">
      {hasFilters ? "No bookings match your filters" : "No bookings yet"}
    </p>
    <p className="mb-4 max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
      {hasFilters
        ? "Try adjusting your search or filters to find what you're looking for."
        : "Bookings will appear here once customers start scheduling appointments."}
    </p>
    {hasFilters && (
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        className="rounded-lg"
      >
        Clear filters
      </Button>
    )}
  </div>
);

export default BookingsEmptyState;
