"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Loader2, CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRequestLeave } from "@/hooks/api/useLeave";

interface Props {
  open: boolean;
  onClose: () => void;
  isOwner: boolean;
}

const RequestLeaveModal = ({ open, onClose, isOwner }: Props) => {
  const { mutate: requestLeave, isPending } = useRequestLeave();

  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSubmit = () => {
    setError(null);

    if (!range?.from) {
      setError("Please pick a start date.");
      return;
    }
    if (!range.to) {
      setError("Please pick an end date.");
      return;
    }

    // Treat "tomorrow" as the earliest valid start (backend requires start > now)
    if (range.from <= today) {
      setError("Start date must be in the future.");
      return;
    }

    requestLeave(
      {
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: format(range.to, "yyyy-MM-dd"),
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          // Reset form
          setRange(undefined);
          setReason("");
          setError(null);
          onClose();
        },
      },
    );
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && !isPending) {
      // Reset on close
      setRange(undefined);
      setReason("");
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
              <CalendarDays className="h-4.5 w-4.5" />
            </span>
            {isOwner ? "Add Leave" : "Request Leaves"}
          </DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Block off dates from your calendar. This will be auto-approved."
              : "Submit a time-off request for approval."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Date range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Leave dates <span className="text-destructive">*</span>
            </Label>
            <div className="flex justify-center rounded-2xl border border-border bg-card p-2 shadow-sm">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                disabled={(d) => d <= today}
                numberOfMonths={1}
                className={cn(
                  "[--cell-size:--spacing(9)]",
                  "**:data-[selected-single=true]:bg-brand-500!",
                  "**:data-[selected-single=true]:text-white!",
                  "**:data-[range-start=true]:bg-brand-500!",
                  "**:data-[range-start=true]:text-white!",
                  "**:data-[range-end=true]:bg-brand-500!",
                  "**:data-[range-end=true]:text-white!",
                  "**:data-[range-middle=true]:bg-brand-500/15!",
                  "**:data-[range-middle=true]:text-brand-600!",
                  "dark:**:data-[range-middle=true]:text-brand-400!",
                )}
              />
            </div>

            {/* Inline preview */}
            {range?.from && range?.to && (
              <p className="rounded-lg bg-brand-500/[0.06] px-3 py-2 text-center text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                {format(range.from, "EEE, MMM d")} →{" "}
                {format(range.to, "EEE, MMM d, yyyy")}
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Reason{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional — e.g. family event, vacation"
              className="h-20 resize-none rounded-xl"
              disabled={isPending}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
            className="h-11 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isOwner ? "Adding..." : "Submitting..."}
              </>
            ) : isOwner ? (
              "Add Leave"
            ) : (
              "Submit Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestLeaveModal;
