import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Zap, AlignLeft, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import ServiceCardActions from "@/components/dashboard/services/ServiceCardActions";
import type { Service } from "@/types";

type Props = {
  service: Service;
  currency: string;
  onEdit: (service: Service) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
};

const ServiceCard = ({
  service,
  currency,
  onEdit,
  onToggle,
  onDelete,
  isLoading = false,
}: Props) => (
  <Card
    className={cn(
      "group gap-0 overflow-hidden rounded-2xl border border-border bg-card py-0 shadow-sm transition-all duration-200",
      "hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10",
      isLoading && "pointer-events-none opacity-50",
      !service.isActive && "opacity-65",
    )}
  >
    <CardHeader className="p-5 pb-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              service.isActive
                ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-foreground">
              {service.name}
            </p>
            <Badge
              className={cn(
                "mt-1.5 gap-1.5 border-0 text-xs font-medium",
                service.isActive
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  service.isActive ? "bg-brand-500" : "bg-muted-foreground/60",
                )}
              />
              {service.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <ServiceCardActions
          service={service}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </div>
    </CardHeader>
    <CardContent className="p-5 pt-4">
      {/* Price — prominent */}
      <p className="mb-4 text-2xl font-bold tracking-tight text-foreground">
        {currency}
        {service.price}
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          per session
        </span>
      </p>

      {/* Meta pills */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{service.durationMins} min</span>
        </div>

        {service.buffer > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            <span>+{service.buffer}min buffer</span>
          </div>
        )}
      </div>

      {/* Description */}
      {service.description && (
        <div className="mt-3 flex items-start gap-1.5 border-t border-border pt-3">
          <AlignLeft className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default ServiceCard;
