"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, Loader2 } from "lucide-react";

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
  <Card className="rounded-2xl border border-border bg-card overflow-hidden">
    {/* Header */}
    <CardHeader className="flex items-center justify-between px-6  border-b border-border">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isEditing ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs"
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
              className="h-8 px-3 text-xs bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-sm shadow-brand-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
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
            className="h-8 px-3 text-xs text-muted-foreground hover:text-brand-600 dark:hover:text-brand-400"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
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
