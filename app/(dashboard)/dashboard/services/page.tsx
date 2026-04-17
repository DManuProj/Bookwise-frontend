"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ServiceCard from "@/components/dashboard/services/ServiceCard";
import ServiceFormModal from "@/components/dashboard/services/ServiceFormModal";
import type { Service } from "@/types";
import ServicesStatsStrip from "@/components/dashboard/services/ServicesStatsStrip";
import ServicesEmptyState from "@/components/dashboard/services/ServicesEmptyState";

/* ── Placeholder data ── */
const INITIAL_SERVICES: Service[] = [
  {
    id: "s1",
    name: "Haircut",
    duration: 45,
    price: 35,
    buffer: 10,
    description: "Classic haircut including wash and style.",
    isActive: true,
  },
  {
    id: "s2",
    name: "Deep Tissue Massage",
    duration: 60,
    price: 80,
    buffer: 15,
    description: "Therapeutic massage targeting deep muscle layers.",
    isActive: true,
  },
  {
    id: "s3",
    name: "Manicure",
    duration: 30,
    price: 25,
    buffer: 5,
    description: "Full manicure with nail shaping and polish.",
    isActive: true,
  },
  {
    id: "s4",
    name: "Swedish Massage",
    duration: 60,
    price: 70,
    buffer: 15,
    description: "Relaxing full body massage with long smooth strokes.",
    isActive: true,
  },
  {
    id: "s5",
    name: "Beard Trim",
    duration: 20,
    price: 20,
    buffer: 5,
    description: "",
    isActive: true,
  },
  {
    id: "s6",
    name: "Facial",
    duration: 60,
    price: 65,
    buffer: 10,
    description: "Deep cleansing facial treatment for all skin types.",
    isActive: true,
  },
  {
    id: "s7",
    name: "Hot Stone Massage",
    duration: 90,
    price: 110,
    buffer: 15,
    description: "Relaxing massage using heated basalt stones.",
    isActive: false,
  },
  {
    id: "s8",
    name: "Pedicure",
    duration: 45,
    price: 35,
    buffer: 5,
    description: "",
    isActive: false,
  },
];

/* ── Page ── */
const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
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
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
    );
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = (data: Omit<Service, "id">) => {
    if (editService) {
      // Edit existing
      setServices((prev) =>
        prev.map((s) => (s.id === editService.id ? { ...s, ...data } : s)),
      );
    } else {
      // Add new
      setServices((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
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
      {services.length > 0 && (
        <ServicesStatsStrip
          total={services.length}
          active={active}
          inactive={inactive}
        />
      )}

      {/* Grid or empty */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              currency="$"
              onEdit={handleEdit}
              onToggle={handleToggle}
              onDelete={handleDelete}
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
      />
    </div>
  );
};

export default ServicesPage;
