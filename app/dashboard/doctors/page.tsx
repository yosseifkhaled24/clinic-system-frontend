  "use client";

  import { useEffect, useMemo, useState } from "react";

  import { DashboardLayout } from "@/components/layout/DashboardLayout";
  import { Button } from "@/components/ui/Button";

  import DoctorTable from "@/components/dashboard/doctors/DoctorTable";
  import DoctorModal from "@/components/dashboard/doctors/DoctorModal";
  import DeleteDoctorDialog from "@/components/dashboard/doctors/DeleteDoctorDialog";
  import SearchDoctor from "@/components/dashboard/doctors/SearchDoctor";

  import { useAuth } from "@/context/AuthContext";
  import { useLanguage } from "@/context/LanguageContext";

  import { doctorsService } from "@/services/doctors.service";

  import { getDictionary } from "@/lib/i18n";
  import { getErrorMessage } from "@/lib/errors";

  import type { Doctor } from "@/types/doctor";

  export default function DashboardDoctorsPage() {
    const { language } = useLanguage();
    const { user } = useAuth();

    const dict = getDictionary(language);

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

    const [doctorToDelete, setDoctorToDelete] =
      useState<Doctor | null>(null);

    const [search, setSearch] = useState("");

    const isAdmin = user?.role === "admin";

    useEffect(() => {
      loadDoctors();
    }, []);

 async function loadDoctors() {
  try {
    setIsLoading(true);

    const response = await doctorsService.getAll();

    console.log("GET DOCTORS:", response);

    setDoctors(response);

    setError("");
  } finally {
    setIsLoading(false);
  }
}

    const filteredDoctors = useMemo(() => {
      if (!search.trim()) return doctors;

      const q = search.toLowerCase();

      return doctors.filter((doctor) => {
        return (
          doctor.name.toLowerCase().includes(q) ||
          (doctor.specialty ?? "")
            .toLowerCase()
            .includes(q) ||
          (doctor.email ?? "")
            .toLowerCase()
            .includes(q) ||
          (doctor.phone ?? "")
            .toLowerCase()
            .includes(q)
        );
      });
    }, [doctors, search]);

    function openCreateModal() {
      setEditingDoctor(null);
      setShowModal(true);
    }

    function openEditModal(doctor: Doctor) {
      setEditingDoctor(doctor);
      setShowModal(true);
    }
      function closeModal() {
      setShowModal(false);
      setEditingDoctor(null);
    }

    async function handleSubmit(form: FormData) {
      try {
        setIsSubmitting(true);
        setError("");

        if (editingDoctor) {
          await doctorsService.update(editingDoctor.id, form);
        } else {
          await doctorsService.create(form);
        }

        closeModal();

        await loadDoctors();
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Failed to save doctor."
          )
        );
      } finally {
        setIsSubmitting(false);
      }
    }

    function askDelete(doctor: Doctor) {
      setDoctorToDelete(doctor);
    }

    function closeDeleteDialog() {
      setDoctorToDelete(null);
    }

    async function confirmDelete() {
      if (!doctorToDelete) return;

      try {
        await doctorsService.delete(
          doctorToDelete.id
        );

        setDoctors((prev) =>
          prev.filter(
            (d) => d.id !== doctorToDelete.id
          )
        );

        closeDeleteDialog();
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Failed to delete doctor."
          )
        );
      }
    }

    return (
      <DashboardLayout
        title={dict.dashboardPages.doctors.title}
        description={
          dict.dashboardPages.doctors.description
        }
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <SearchDoctor
            value={search}
            onChange={setSearch}
          />

          {isAdmin && (
            <Button onClick={openCreateModal}>
              + Add Doctor
            </Button>
          )}

        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-slate-500">
            Loading...
          </p>
        ) : (
          <DoctorTable
            doctors={filteredDoctors}
            onEdit={openEditModal}
            onDelete={askDelete}
          />
        )}
              <DoctorModal
          open={showModal}
          initialData={editingDoctor}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />

        <DeleteDoctorDialog
          open={doctorToDelete !== null}
          doctorName={doctorToDelete?.name}
          onCancel={closeDeleteDialog}
          onConfirm={confirmDelete}
        />

      </DashboardLayout>
    );
  }