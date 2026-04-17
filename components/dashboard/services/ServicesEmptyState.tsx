import { Button } from "@/components/ui/button";
import { Scissors, Plus } from "lucide-react";

type Props = {
  onAdd: () => void;
};

const ServicesEmptyState = ({ onAdd }: Props) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4">
      <Scissors className="h-7 w-7 text-brand-500" />
    </div>
    <p className="text-base font-semibold text-foreground mb-1">
      No services yet
    </p>
    <p className="text-sm text-muted-foreground mb-5 max-w-xs">
      Add your first service so customers can start booking appointments.
    </p>
    <Button
      onClick={onAdd}
      className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl shadow-sm shadow-brand-500/20"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Service
    </Button>
  </div>
);

export default ServicesEmptyState;
