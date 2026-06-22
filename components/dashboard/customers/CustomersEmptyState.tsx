import { UserRound } from "lucide-react";

const CustomersEmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
      <UserRound className="h-7 w-7" />
    </div>
    <p className="mb-1 text-base font-bold tracking-tight text-foreground">
      No customers yet
    </p>
    <p className="max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
      Customers appear here automatically once bookings are made through your
      booking page or the AI receptionist.
    </p>
  </div>
);

export default CustomersEmptyState;
