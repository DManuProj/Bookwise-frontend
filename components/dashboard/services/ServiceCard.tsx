import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Zap, AlignLeft } from "lucide-react";
import ServiceCardActions from "@/components/dashboard/services/ServiceCardActions";

/* ── Icon cycling — same as onboarding ── */
import {
  Scissors,
  Dumbbell,
  Heart,
  Stethoscope,
  Flower2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import type { Service } from "@/types";

const SERVICE_ICONS = [
  {
    icon: Sparkles,
    bg: "bg-brand-500/10",
    color: "text-brand-600  dark:text-brand-400",
  },
  {
    icon: Scissors,
    bg: "bg-violet-500/10",
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Dumbbell,
    bg: "bg-blue-500/10",
    color: "text-blue-600   dark:text-blue-400",
  },
  {
    icon: Heart,
    bg: "bg-rose-500/10",
    color: "text-rose-600   dark:text-rose-400",
  },
  {
    icon: Stethoscope,
    bg: "bg-cyan-500/10",
    color: "text-cyan-600   dark:text-cyan-400",
  },
  {
    icon: Flower2,
    bg: "bg-pink-500/10",
    color: "text-pink-600   dark:text-pink-400",
  },
  {
    icon: BookOpen,
    bg: "bg-amber-500/10",
    color: "text-amber-600  dark:text-amber-400",
  },
];

type Props = {
  service: Service;
  index: number;
  currency: string;
  onEdit: (service: Service) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const ServiceCard = ({
  service,
  index,
  currency,
  onEdit,
  onToggle,
  onDelete,
}: Props) => {
  const iconConfig = SERVICE_ICONS[index % SERVICE_ICONS.length];
  const Icon = iconConfig.icon;

  return (
    <Card
      className={` border border-brand-500/35 dark:border-brand-500/10 transition-all duration-200 ${
        !service.isActive ? "opacity-50 bg-gray-300" : ""
      }`}
    >
      <CardHeader>
        {/* Header row */}
        <div className="flex items-start justify-between ">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${iconConfig.bg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`h-5 w-5 ${iconConfig.color}`} />
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
            <span>{service.duration} min</span>
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
};

export default ServiceCard;
