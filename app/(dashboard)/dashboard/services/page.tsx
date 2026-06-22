"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ServiceCard from "@/components/dashboard/services/ServiceCard";
import ServiceFormModal from "@/components/dashboard/services/ServiceFormModal";
import type { Service, ServiceFormInputs } from "@/types";
import ServicesStatsStrip from "@/components/dashboard/services/ServicesStatsStrip";
import ServicesEmptyState from "@/components/dashboard/services/ServicesEmptyState";
import ServicesGridSkeleton from "@/components/dashboard/services/ServicesGridSkeleton";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "@/hooks/api/useServices";
import { useTierUsage } from "@/hooks/api/useBilling";
import Link from "next/link";

/* ── Page ── */
const ServicesPage = () => {
  const { data: services = [], isPending } = useServices();
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();

  const { data: usage } = useTierUsage();
  const atCap = usage?.services.atCap ?? false;

  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  /* ── Stats ── */
  const active = services.filter((s) => s.isActive).length;
  const inactive = services.filter((s) => !s.isActive).length;

  /* ── Handlers ── */
  const handleAdd = () => {
    setEditService(null);
    setModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditService(service);
    setModalOpen(true);
  };

  const handleToggle = (id: string) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    updateService({ id, data: { isActive: !service.isActive } });
  };

  const handleDelete = (id: string) => {
    deleteService(id);
  };

  const handleSave = (data: ServiceFormInputs) => {
    if (editService) {
      updateService(
        { id: editService.id, data },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createService(data, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  return (
    <div className="mx-auto max-w-8xl space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Services
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage what your business offers.
          </p>
        </div>
        {atCap ? (
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {usage?.services.used} / {usage?.services.limit} services used
            </span>
            <Button
              asChild
              className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 hover:-translate-y-0.5"
            >
              <Link href="/dashboard/settings/billing">
                <Plus className="h-4 w-4" />
                Upgrade to add more
              </Link>
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAdd}
            className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add New Service
          </Button>
        )}
      </div>

      {/* Stats */}
      {!isPending && services.length > 0 && (
        <ServicesStatsStrip
          total={services.length}
          active={active}
          inactive={inactive}
        />
      )}

      {/* Grid, skeleton, or empty */}
      {isPending ? (
        <ServicesGridSkeleton />
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              currency="$"
              onEdit={handleEdit}
              onToggle={handleToggle}
              onDelete={handleDelete}
              isLoading={isCreating || isUpdating || isDeleting}
            />
          ))}
        </div>
      ) : (
        <ServicesEmptyState onAdd={handleAdd} />
      )}

      {/* Add / Edit modal — same component, reused */}
      <ServiceFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editService={editService}
        currency="$"
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
};

export default ServicesPage;
