"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, Loader2, Check } from "lucide-react";

type Props = {
  title: string;
  description: string;
  isEditing?: boolean;
  isLoading?: boolean;
  isSubmitting?: boolean;
  isDirty?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  children: React.ReactNode;
};

const noop = () => {};

const SettingsCard = ({
  title,
  description,
  isEditing = false,
  isLoading = false,
  isSubmitting = false,
  isDirty = false,
  onEdit = noop,
  onCancel = noop,
  onSave = noop,
  children,
}: Props) => (
  <Card className="overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-sm">
    {/* Header */}
    <CardHeader className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-6 py-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isEditing ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg px-3 text-xs text-muted-foreground hover:text-foreground"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!isDirty || isSubmitting}
              onClick={onSave}
              className="h-8 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm shadow-brand-500/20 transition-all duration-200 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Save
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            disabled={isLoading}
            className="h-8 rounded-lg border border-transparent px-3 text-xs text-muted-foreground transition-colors hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>
    </CardHeader>

    {/* Body */}
    <CardContent className="px-6 py-5">{children}</CardContent>
  </Card>
);

export default SettingsCard;
