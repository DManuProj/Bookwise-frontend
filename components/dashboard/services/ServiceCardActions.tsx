"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
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

const ServiceCardActions = ({ service, onEdit, onToggle, onDelete, isLoading = false }: Props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onEdit(service)} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit service
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onToggle(service.id)} className="gap-2">
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
            className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/8"
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
