import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Zap, AlignLeft, Tag } from "lucide-react";
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
    className={`${isLoading ? "opacity-50" : ""} border border-brand-500/35 dark:border-brand-500/10 transition-all duration-200 ${
      !service.isActive ? "opacity-50 bg-gray-300" : ""
    }`}
  >
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
            <Tag className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {service.name}
            </p>
            <Badge
              className={`text-xs border-0 mt-1 ${
                service.isActive
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
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
    <CardContent className="px-5">
      {/* Price — prominent */}
      <p className="text-2xl font-bold text-foreground mb-4">
        {currency}
        {service.price}
        <span className="text-sm font-normal text-muted-foreground ml-1">
          per session
        </span>
      </p>

      {/* Meta pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{service.durationMins} min</span>
        </div>

        {service.buffer > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5" />
            <span>+{service.buffer}min buffer</span>
          </div>
        )}
      </div>

      {/* Description */}
      {service.description && (
        <div className="mt-3 pt-3 border-t border-border flex items-start gap-1.5">
          <AlignLeft className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default ServiceCard;
