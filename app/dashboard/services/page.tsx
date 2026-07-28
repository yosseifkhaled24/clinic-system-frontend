"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

import ServiceTable from "@/components/dashboard/services/ServiceTable";
import ServiceForm from "@/components/dashboard/services/ServiceForm";
import DeleteServiceDialog from "@/components/dashboard/services/DeleteServiceDialog";
import SearchService from "@/components/dashboard/services/SearchService";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { servicesService } from "@/services/services.service";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";
import { SkeletonTable } from "@/components/ui/Skeleton";

import type { Service } from "@/types/service";

export default function DashboardServicesPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const dict = getDictionary(language);

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingService, setEditingService] =
    useState<Service | null>(null);

  const [serviceToDelete, setServiceToDelete] =
    useState<Service | null>(null);

  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setIsLoading(true);

      const response = await servicesService.getAll();

      setServices(response);

      setError("");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load services."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredServices = useMemo(() => {
    if (!search.trim()) return services;

    const q = search.toLowerCase();

    return services.filter((service) => {
      return (
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q)
      );
    });
  }, [services, search]);

  function openCreateForm() {
    setEditingService(null);
    setShowForm(true);
  }

  function openEditForm(service: Service) {
    setEditingService(service);
    setShowForm(true);
  }

  function closeForm() {
    setEditingService(null);
    setShowForm(false);
  }

  async function handleSubmit(form: FormData) {
    try {
      setIsSubmitting(true);
      setError("");

      if (editingService) {
        await servicesService.update(
          editingService.id,
          form
        );
      } else {
        await servicesService.create(form);
      }

      closeForm();

      await loadServices();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save service."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function askDelete(service: Service) {
    setServiceToDelete(service);
  }

  function closeDeleteDialog() {
    setServiceToDelete(null);
  }

  async function confirmDelete() {
    if (!serviceToDelete) return;

    try {
      await servicesService.delete(
        serviceToDelete.id
      );

      setServices((prev) =>
        prev.filter(
          (s) => s.id !== serviceToDelete.id
        )
      );

      closeDeleteDialog();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to delete service."
        )
      );
    }
  }
    return (
    <DashboardLayout
      title={dict.dashboardPages.services.title}
      description={dict.dashboardPages.services.description}
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="mx-auto max-w-6xl">

          <div className="mb-8 flex items-center justify-between">

            <div>

              

              <p className="mt-2 text-slate-500">
                {editingService
                  ? "Update service information."
                  : "Fill service information to create a new service."}
              </p>

            </div>

            <Button
              variant="ghost"
              onClick={closeForm}
            >
              ← Back
            </Button>

          </div>

          <ServiceForm
            initialData={editingService}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />

        </div>
      ) : (
        <>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Services
              </h2>

              <p className="mt-2 text-slate-500">
                Manage all clinic services.
              </p>

            </div>

            {isAdmin && (
              <Button onClick={openCreateForm}>
                + Add Service
              </Button>
            )}

          </div>

          <div className="mb-6 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Total Services
              </p>

              <h3 className="mt-3 text-4xl font-bold text-slate-900">
                {services.length}
              </h3>

            </div>

            <div className="md:col-span-2">

              <SearchService
                value={search}
                onChange={setSearch}
              />

            </div>

          </div>

          {isLoading ? (
            <SkeletonTable rows={5} cols={3} />
          ) : (
            <ServiceTable
              services={filteredServices}
              onEdit={openEditForm}
              onDelete={askDelete}
            />
          )}

        </>
      )}
            <DeleteServiceDialog
        open={serviceToDelete !== null}
        serviceName={serviceToDelete?.name}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />

    </DashboardLayout>
  );
}
