import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

type Props = { onInvite: () => void };

const StaffEmptyState = ({ onInvite }: Props) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
      <Users className="h-7 w-7 text-brand-500" />
    </div>
    <p className="text-base font-semibold text-foreground mb-1">No staff yet</p>
    <p className="text-sm text-muted-foreground mb-5 max-w-xs">
      Invite your team members so they can manage bookings and be assigned to
      appointments.
    </p>
    <Button
      onClick={onInvite}
      className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm shadow-brand-500/20"
    >
      <Plus className="h-4 w-4 mr-2" />
      Invite Staff
    </Button>
  </div>
);

export default StaffEmptyState;
