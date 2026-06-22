import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

type Props = { onInvite: () => void };

const StaffEmptyState = ({ onInvite }: Props) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-20 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/30">
      <Users className="h-7 w-7" />
    </div>
    <p className="mb-1 text-base font-bold tracking-tight text-foreground">
      No staff yet
    </p>
    <p className="mb-5 max-w-xs text-sm leading-relaxed text-muted-foreground text-pretty">
      Invite your team members so they can manage bookings and be assigned to
      appointments.
    </p>
    <Button
      onClick={onInvite}
      className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600"
    >
      <Plus className="mr-2 h-4 w-4" />
      Invite Staff
    </Button>
  </div>
);

export default StaffEmptyState;
