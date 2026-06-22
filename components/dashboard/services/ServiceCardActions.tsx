"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import type { Service } from "@/types";

type Props = {
  service: Service;
  onEdit: (service: Service) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
};

const ServiceCardActions = ({
  service,
  onEdit,
  onToggle,
  onDelete,
  isLoading = false,
}: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground data-[state=open]:border-brand-500/30 data-[state=open]:bg-brand-500/10 data-[state=open]:text-brand-600 dark:data-[state=open]:text-brand-400"
            disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5">
          <DropdownMenuItem
            onClick={() => onEdit(service)}
            className="cursor-pointer gap-2.5 rounded-lg [&>svg]:text-muted-foreground focus:[&>svg]:text-foreground"
          >
            <Pencil className="h-4 w-4" />
            Edit service
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onToggle(service.id)}
            className="cursor-pointer gap-2.5 rounded-lg [&>svg]:text-muted-foreground focus:[&>svg]:text-foreground"
          >
            {service.isActive ? (
              <>
                <ToggleLeft className="h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer gap-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive [&>svg]:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete service
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete service"
        description={`Are you sure you want to delete "${service.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isLoading}
        onConfirm={() => {
          onDelete(service.id);
          setDeleteOpen(false);
        }}
      />
    </>
  );
};

export default ServiceCardActions;
