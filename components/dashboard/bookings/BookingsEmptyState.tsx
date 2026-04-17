import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  hasFilters: boolean;
  onClear: () => void;
};

const BookingsEmptyState = ({ hasFilters, onClear }: Props) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
      <CalendarDays className="h-7 w-7 text-brand-500" />
    </div>
    <p className="text-base font-semibold text-foreground mb-1">
      {hasFilters ? "No bookings match your filters" : "No bookings yet"}
    </p>
    <p className="text-sm text-muted-foreground mb-4 max-w-xs">
      {hasFilters
        ? "Try adjusting your search or filters to find what you're looking for."
        : "Bookings will appear here once customers start scheduling appointments."}
    </p>
    {hasFilters && (
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear filters
      </Button>
    )}
  </div>
);

export default BookingsEmptyState;
