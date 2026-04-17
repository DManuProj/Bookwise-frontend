import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AccentColor = "brand" | "amber" | "blue" | "red";

type Props = {
  accent: AccentColor;
  children: React.ReactNode;
};

const ACCENT_MAP: Record<AccentColor, string> = {
  brand: "from-brand-500 to-brand-400",
  amber: "from-amber-500 to-amber-400",
  blue: "from-blue-500  to-blue-400",
  red: "from-destructive to-red-400",
};

const InviteCard = ({ accent, children }: Props) => (
  <Card className="w-full overflow-hidden border-border bg-card p-0 gap-0 rounded-2xl shadow-sm">
    {/* Gradient accent bar */}
    <div className={cn("h-1.5 w-full bg-gradient-to-r", ACCENT_MAP[accent])} />

    <CardContent className="p-8">{children}</CardContent>
  </Card>
);

export default InviteCard;
