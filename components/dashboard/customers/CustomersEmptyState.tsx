import { UserRound } from "lucide-react";

const CustomersEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
      <UserRound className="h-7 w-7 text-brand-500" />
    </div>
    <p className="text-base font-semibold text-foreground mb-1">
      No customers yet
    </p>
    <p className="text-sm text-muted-foreground max-w-xs">
      Customers appear here automatically once bookings are made through your
      booking page or the AI receptionist.
    </p>
  </div>
);

export default CustomersEmptyState;
