"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, PowerOff, Power, Trash2 } from "lucide-react";
import type { Service } from "@/types";

type Props = {
  service: Service;
  onEdit: (service: Service) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const ServiceCardActions = ({ service, onEdit, onToggle, onDelete }: Props) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Actions</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-44">
      <DropdownMenuItem className="gap-2" onClick={() => onEdit(service)}>
        <Pencil className="h-4 w-4" />
        Edit service
      </DropdownMenuItem>

      <DropdownMenuItem className="gap-2" onClick={() => onToggle(service.id)}>
        {service.isActive ? (
          <>
            <PowerOff className="h-4 w-4" />
            Deactivate
          </>
        ) : (
          <>
            <Power className="h-4 w-4" />
            Activate
          </>
        )}
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/8"
        onClick={() => onDelete(service.id)}
      >
        <Trash2 className="h-4 w-4" />
        Delete service
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ServiceCardActions;
