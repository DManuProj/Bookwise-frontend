import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const ALERTS = [
  {
    message: "3 bookings pending confirmation",
    href: "/dashboard/bookings",
  },
];

const AlertsBanner = () => {
  if (ALERTS.length === 0) return null;

  return (
    <div className="space-y-2">
      {ALERTS.map((alert, i) => (
        <Alert
          key={i}
          className="border-amber-500/20 bg-amber-500/5 flex items-center justify-between py-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
            <AlertDescription className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {alert.message}
            </AlertDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 shrink-0"
            asChild
          >
            <Link href={alert.href}>
              Review <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </Alert>
      ))}
    </div>
  );
};

export default AlertsBanner;
