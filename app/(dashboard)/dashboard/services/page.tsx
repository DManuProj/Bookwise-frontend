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

/* ── Page ── */
const ServicesPage = () => {
  const { data: services = [], isPending } = useServices();
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();

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
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Services</h1>
          <p className="text-sm text-muted-foreground">
            Manage what your business offers.
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-brand-500 hover:bg-brand-600 text-white h-11 rounded-lg shadow-sm shadow-brand-500/20"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
