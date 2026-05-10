"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
};

const ConfirmationModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  isLoading = false,
  onConfirm,
}: ConfirmationModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <DialogTitle className="text-lg font-bold text-destructive">
            {title}
          </DialogTitle>
        </div>
        <DialogDescription className="text-sm text-muted-foreground">
          {description}
        </DialogDescription>
      </DialogHeader>

      <div className="px-6 py-4 border-t border-border flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-xl"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="flex-1 rounded-xl disabled:opacity-50"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {confirmLabel ? `${confirmLabel}...` : "Deleting..."}
            </>
          ) : confirmLabel ? (
            confirmLabel
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default ConfirmationModal;
