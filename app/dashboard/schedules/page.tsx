"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

import ScheduleTable from "@/components/dashboard/schedules/ScheduleTable";
import ScheduleForm from "@/components/dashboard/schedules/ScheduleForm";
import SearchSchedule from "@/components/dashboard/schedules/SearchSchedule";
import DeleteScheduleDialog from "@/components/dashboard/schedules/DeleteScheduleDialog";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

import { schedulesService } from "@/services/schedules.service";
import { doctorsService } from "@/services/doctors.service";

import { getDictionary } from "@/lib/i18n";
import { getErrorMessage } from "@/lib/errors";

import type {
  Schedule,
  SchedulePayload,
} from "@/types/schedule";

import type { Doctor } from "@/types/doctor";

export default function DashboardSchedulesPage() {
  const { language } = useLanguage();
  const { user } = useAuth();

  const dict = getDictionary(language);

  const [schedules, setSchedules] = useState<
    Schedule[]
  >([]);

  const [doctors, setDoctors] = useState<
    Doctor[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingSchedule, setEditingSchedule] =
    useState<Schedule | null>(null);

  const [scheduleToDelete, setScheduleToDelete] =
    useState<Schedule | null>(null);

  const [search, setSearch] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);

      const [
        schedulesResponse,
        doctorsResponse,
      ] = await Promise.all([
        schedulesService.getAll(),
        doctorsService.getAll(),
      ]);

      setSchedules(schedulesResponse);
      setDoctors(doctorsResponse);

      setError("");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to load schedules."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredSchedules = useMemo(() => {
    if (!search.trim()) return schedules;

    const q = search.toLowerCase();

    return schedules.filter((schedule) => {
      return (
        schedule.doctor.name
          .toLowerCase()
          .includes(q) ||
        schedule.day
          .toLowerCase()
          .includes(q)
      );
    });
  }, [schedules, search]);

  function openCreateForm() {
    setEditingSchedule(null);
    setShowForm(true);
  }

  function openEditForm(
    schedule: Schedule
  ) {
    setEditingSchedule(schedule);
    setShowForm(true);
  }

  function closeForm() {
    setEditingSchedule(null);
    setShowForm(false);
  }

  async function handleSubmit(
    payload: SchedulePayload
  ) {
    try {
      setIsSubmitting(true);
      setError("");

      if (editingSchedule) {
        await schedulesService.update(
          editingSchedule.id,
          payload
        );
      } else {
        await schedulesService.create(
          payload
        );
      }

      closeForm();

      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save schedule."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function askDelete(
    schedule: Schedule
  ) {
    setScheduleToDelete(schedule);
  }

  function closeDeleteDialog() {
    setScheduleToDelete(null);
  }

  async function confirmDelete() {
    if (!scheduleToDelete) return;

    try {
      await schedulesService.delete(
        scheduleToDelete.id
      );

      setSchedules((prev) =>
        prev.filter(
          (s) =>
            s.id !== scheduleToDelete.id
        )
      );

      closeDeleteDialog();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to delete schedule."
        )
      );
    }
  }
    return (
    <DashboardLayout
      title="Doctor Schedules"
      description="Manage doctors working days and availability."
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

              <h2 className="text-3xl font-bold text-slate-900">
                {editingSchedule
                  ? "Edit Schedule"
                  : "Add Schedule"}
              </h2>

              <p className="mt-2 text-slate-500">
                {editingSchedule
                  ? "Update doctor schedule."
                  : "Fill schedule information to create a new schedule."}
              </p>

            </div>

            <Button
              variant="ghost"
              onClick={closeForm}
            >
              ← Back
            </Button>

          </div>

          <ScheduleForm
            doctors={doctors}
            initialData={editingSchedule}
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
                Doctor Schedules
              </h2>

              <p className="mt-2 text-slate-500">
                Manage doctors working days and availability.
              </p>

            </div>

            {isAdmin && (
              <Button onClick={openCreateForm}>
                + Add Schedule
              </Button>
            )}

          </div>

          <div className="mb-6 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">
                Total Schedules
              </p>

              <h3 className="mt-3 text-4xl font-bold text-slate-900">
                {schedules.length}
              </h3>

            </div>

            <div className="md:col-span-2">

              <SearchSchedule
                value={search}
                onChange={setSearch}
              />

            </div>

          </div>
                    {isLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading schedules...
            </div>
          ) : (
            <ScheduleTable
              schedules={filteredSchedules}
              onEdit={openEditForm}
              onDelete={askDelete}
            />
          )}

        </>
      )}

      <DeleteScheduleDialog
        open={scheduleToDelete !== null}
        schedule={scheduleToDelete}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />

    </DashboardLayout>
  );
} 