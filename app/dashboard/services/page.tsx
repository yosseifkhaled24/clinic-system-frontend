"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ApiImage } from "@/components/ui/ApiImage";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { servicesService } from "@/services/services.service";
import type { ServiceItem } from "@/types/service";

export default function DashboardServicesPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const dict = getDictionary(language);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    setIsAdmin(user?.role === "admin");
    loadServices();
  }, [user]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await servicesService.getAll();
      setServices(response);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load services."));
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setFormData({
      name: service.name || "",
      description: service.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await servicesService.delete(id);
      setServices(services.filter((s) => s.id !== id));
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete service."));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await servicesService.update(editingId, formData);
        setServices(
          services.map((s) =>
            s.id === editingId ? { ...s, ...formData } : s
          )
        );
      } else {
        const newService = await servicesService.create(formData);
        setServices([...services, newService]);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", description: "" });
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save service."));
    }
  };

  return (
    <DashboardLayout title={dict.dashboardPages.services.title} description={dict.dashboardPages.services.description}>
      <div className="space-y-6">
        {isAdmin && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: "", description: "" });
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {showForm ? "Cancel" : "+ Add Service"}
          </button>
        )}

        {showForm && isAdmin && (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              {editingId ? "Edit Service" : "Add Service"}
            </h3>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Service Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              {editingId ? "Update Service" : "Add Service"}
            </button>
          </form>
        )}

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="space-y-3">
          {isLoading ?
            <p className="text-sm text-slate-600">{dict.dashboard.loading}</p>
          : services.length === 0 ?
            <p className="text-sm text-slate-600">No services found.</p>
          : (
            services.map((service) => (
              <div key={service.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <ApiImage
                    src={service.image_url}
                    alt={service.name}
                    className="h-14 w-14 rounded-xl object-cover"
                    fallbackClassName="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{service.name}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{service.description}</p>
                  </div>
                  {isAdmin && (
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="rounded px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="rounded px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
