"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { getErrorMessage } from "@/lib/errors";
import { getDictionary } from "@/lib/i18n";
import { appointmentsService } from "@/services/appointments.service";
import { contactService } from "@/services/contact.service";
import { dashboardService } from "@/services/dashboard.service";
import { doctorsService } from "@/services/doctors.service";
import { patientsService } from "@/services/patients.service";
import { queueService } from "@/services/queue.service";
import { reviewsService } from "@/services/reviews.service";
import { servicesService } from "@/services/services.service";
import type { Appointment } from "@/types/appointment";
import type { ContactMessage } from "@/types/contact";
import type { DashboardOverview } from "@/types/dashboard";
import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";
import type { QueueResponse } from "@/types/queue";
import type { Review } from "@/types/review";

const emptyOverview: DashboardOverview = {
  doctors_count: 0,
  patients_count: 0,
  services_count: 0,
  appointments_count: 0,
  appointments_today: 0,
  pending_count: 0,
  completed_count: 0,
  cancelled_count: 0,
  reviews_count: 0,
  messages_count: 0,
};

const emptyQueue: QueueResponse = {
  current: null,
  waiting: [],
  finished: [],
};

function isToday(date: string) {
  return date.startsWith(new Date().toISOString().slice(0, 10));
}

export default function DashboardPage() {
  const { language } = useLanguage();
  const dict = getDictionary(language);
  const [overview, setOverview] = useState<DashboardOverview>(emptyOverview);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [queue, setQueue] = useState<QueueResponse>(emptyQueue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSubmittingDoctor, setIsSubmittingDoctor] = useState(false);
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [isSubmittingAppointment, setIsSubmittingAppointment] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
  });
  const [doctorImage, setDoctorImage] = useState<File | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [appointmentForm, setAppointmentForm] = useState({
    doctor_id: "",
    appointment_date: "",
    notes: "",
  });

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [overviewData, appointmentsData, patientsData, reviewsData, messagesData, doctorsData] = await Promise.all([
        dashboardService.getOverview().catch(() => emptyOverview),
        appointmentsService.getAll().catch(() => [] as Appointment[]),
        patientsService.getAll().catch(() => [] as Patient[]),
        reviewsService.getAll().catch(() => [] as Review[]),
        contactService.getAll().catch(() => [] as ContactMessage[]),
        doctorsService.getAll().catch(() => [] as Doctor[]),
      ]);

      const firstDoctor = doctorsData[0];
      const queueData = firstDoctor ? await queueService.getToday(firstDoctor.id).catch(() => emptyQueue) : emptyQueue;

      setOverview(overviewData);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
      setQueue(queueData);
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load dashboard."));
      setOverview(emptyOverview);
      setDoctors([]);
      setAppointments([]);
      setPatients([]);
      setReviews([]);
      setMessages([]);
      setQueue(emptyQueue);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboardData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleCreateDoctor = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionMessage("");
    setActionError("");
    setIsSubmittingDoctor(true);

    try {
      const payload = new FormData();
      payload.append("name", doctorForm.name);
      if (doctorForm.specialty) payload.append("specialty", doctorForm.specialty);
      if (doctorForm.email) payload.append("email", doctorForm.email);
      if (doctorForm.phone) payload.append("phone", doctorForm.phone);
      if (doctorForm.bio) payload.append("bio", doctorForm.bio);
      if (doctorImage) payload.append("image", doctorImage);

      await doctorsService.create(payload);
      setActionMessage("Doctor created successfully.");
      setDoctorForm({ name: "", specialty: "", email: "", phone: "", bio: "", password: "" });
      setDoctorImage(null);
      await loadDashboardData();
    } catch (error) {
      setActionError(getErrorMessage(error, "Unable to create doctor."));
    } finally {
      setIsSubmittingDoctor(false);
    }
  };

  const handleCreateService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionMessage("");
    setActionError("");
    setIsSubmittingService(true);

    try {
      await servicesService.create({
        name: serviceForm.name,
        description: serviceForm.description,
        price: serviceForm.price ? Number(serviceForm.price) : 0,
      });
      setActionMessage("Service created successfully.");
      setServiceForm({ name: "", description: "", price: "" });
      await loadDashboardData();
    } catch (error) {
      setActionError(getErrorMessage(error, "Unable to create service."));
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleCreateAppointment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionMessage("");
    setActionError("");
    setIsSubmittingAppointment(true);

    try {
      await appointmentsService.create({
        doctor_id: Number(appointmentForm.doctor_id),
        appointment_date: appointmentForm.appointment_date,
        notes: appointmentForm.notes,
      });
      setActionMessage("Appointment created successfully.");
      setAppointmentForm({ doctor_id: "", appointment_date: "", notes: "" });
      await loadDashboardData();
    } catch (error) {
      setActionError(getErrorMessage(error, "Unable to create appointment."));
    } finally {
      setIsSubmittingAppointment(false);
    }
  };

  const todayAppointments = useMemo(
    () => appointments.filter((appointment) => isToday(appointment.appointment_date)).slice(0, 5),
    [appointments],
  );

  const pendingAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === "pending").slice(0, 5),
    [appointments],
  );

  const recentAppointments = useMemo(() => appointments.slice(0, 5), [appointments]);
  const latestPatients = useMemo(() => patients.slice(0, 5), [patients]);
  const latestReviews = useMemo(() => reviews.slice(0, 5), [reviews]);
  const latestMessages = useMemo(() => messages.slice(0, 5), [messages]);

  const stats = [
    { label: "Doctors", value: overview.doctors_count, detail: "Manage team", href: "/dashboard/doctors" },
    { label: dict.dashboard.stats.patients, value: overview.patients_count || patients.length, detail: "Latest records", href: "/dashboard/patients" },
    { label: "Services", value: overview.services_count, detail: "Clinic services", href: "/dashboard/services" },
    { label: dict.dashboard.stats.appointments, value: overview.appointments_count || appointments.length, detail: `${overview.appointments_today} ${dict.dashboard.stats.today}`, href: "/dashboard/appointments" },
    { label: "Reviews", value: overview.reviews_count || reviews.length, detail: dict.dashboard.stats.needsAttention, href: "/dashboard/reviews" },
    { label: "Messages", value: overview.messages_count || messages.length, detail: "Patient contact", href: "/dashboard/messages" },
  ];

  return (
    <DashboardLayout title={dict.dashboard.overviewTitle} description={dict.dashboard.overviewDescription}>
      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
      {actionMessage ? <p className="mb-4 text-sm text-emerald-600">{actionMessage}</p> : null}
      {actionError ? <p className="mb-4 text-sm text-rose-600">{actionError}</p> : null}

      <section className="mb-8 rounded-2xl border border-slate-200 p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Quick create</h2>
          <p className="mt-1 text-sm text-slate-600">Create the core records directly from the dashboard.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <form onSubmit={handleCreateDoctor} className="space-y-3 rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Add doctor</h3>
            <input value={doctorForm.name} onChange={(event) => setDoctorForm((form) => ({ ...form, name: event.target.value }))} required placeholder="Name" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <input value={doctorForm.specialty} onChange={(event) => setDoctorForm((form) => ({ ...form, specialty: event.target.value }))} placeholder="Specialty" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <input value={doctorForm.email} onChange={(event) => setDoctorForm((form) => ({ ...form, email: event.target.value }))} type="email" placeholder="Email" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <input value={doctorForm.phone} onChange={(event) => setDoctorForm((form) => ({ ...form, phone: event.target.value }))} placeholder="Phone" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <input value={doctorForm.password} onChange={(event) => setDoctorForm((form) => ({ ...form, password: event.target.value }))} type="password" placeholder="Password (not supported by current API)" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p className="text-xs text-slate-500">Doctor password cannot be saved because the current Laravel doctors endpoint does not accept a password field.</p>
            <input onChange={(event) => setDoctorImage(event.target.files?.[0] ?? null)} type="file" accept="image/png,image/jpeg,image/jpg" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" />
            <textarea value={doctorForm.bio} onChange={(event) => setDoctorForm((form) => ({ ...form, bio: event.target.value }))} placeholder="Bio" rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <button disabled={isSubmittingDoctor} className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {isSubmittingDoctor ? "Saving..." : "Create doctor"}
            </button>
          </form>

          <form onSubmit={handleCreateService} className="space-y-3 rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Add service</h3>
            <input value={serviceForm.name} onChange={(event) => setServiceForm((form) => ({ ...form, name: event.target.value }))} required placeholder="Name" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={serviceForm.description} onChange={(event) => setServiceForm((form) => ({ ...form, description: event.target.value }))} required placeholder="Description" rows={4} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <input value={serviceForm.price} onChange={(event) => setServiceForm((form) => ({ ...form, price: event.target.value }))} required type="number" min="0" step="0.01" placeholder="Price" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <button disabled={isSubmittingService} className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {isSubmittingService ? "Saving..." : "Create service"}
            </button>
          </form>

          <form onSubmit={handleCreateAppointment} className="space-y-3 rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Create appointment</h3>
            <select value={appointmentForm.doctor_id} onChange={(event) => setAppointmentForm((form) => ({ ...form, doctor_id: event.target.value }))} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="">Select doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
            <input value={appointmentForm.appointment_date} onChange={(event) => setAppointmentForm((form) => ({ ...form, appointment_date: event.target.value }))} required type="date" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={appointmentForm.notes} onChange={(event) => setAppointmentForm((form) => ({ ...form, notes: event.target.value }))} placeholder="Notes" rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <button disabled={isSubmittingAppointment || doctors.length === 0} className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {isSubmittingAppointment ? "Saving..." : "Create appointment"}
            </button>
          </form>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
          Patient creation is not available because the Laravel API has no working patient create handler. You can still manage existing patients from <Link href="/dashboard/patients" className="font-semibold text-slate-900">Patients Management</Link>.
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href} className="rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{loading ? "..." : stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.detail}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{dict.dashboard.todayAppointments}</h2>
            <span className="text-sm text-slate-500">{loading ? dict.dashboard.loading : `${todayAppointments.length} ${dict.dashboard.scheduled}`}</span>
          </div>
          <div className="space-y-3">
            {!loading && todayAppointments.length === 0 ? <p className="text-sm text-slate-600">No appointments scheduled today.</p> : null}
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{appointment.doctor.name}</p>
                  <p className="text-sm text-slate-600">{appointment.patient.name}</p>
                </div>
                <span className="text-sm font-semibold text-slate-700">{appointment.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Queue</h2>
            <Link href="/dashboard/queue" className="text-sm font-semibold text-slate-700">Open -&gt;</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Current</p>
              <p className="mt-2 font-semibold text-slate-900">{queue.current?.patient.name || "None"}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Waiting</p>
              <p className="mt-2 font-semibold text-slate-900">{queue.waiting.length}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Finished</p>
              <p className="mt-2 font-semibold text-slate-900">{queue.finished.length}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent appointments</h2>
            <Link href="/dashboard/appointments" className="text-sm font-semibold text-slate-700">Open -&gt;</Link>
          </div>
          <div className="space-y-3">
            {!loading && recentAppointments.length === 0 ? <p className="text-sm text-slate-600">No appointments found.</p> : null}
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{appointment.patient.name}</span>
                <span className="text-slate-600">{appointment.appointment_date}</span>
                <span className="text-slate-500">{appointment.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Pending appointments</h2>
            <Link href="/dashboard/appointments" className="text-sm font-semibold text-slate-700">Open -&gt;</Link>
          </div>
          <div className="space-y-3">
            {!loading && pendingAppointments.length === 0 ? <p className="text-sm text-slate-600">No pending appointments.</p> : null}
            {pendingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{appointment.patient.name}</span>
                <span className="text-slate-600">{appointment.doctor.name}</span>
                <span className="text-slate-500">{appointment.appointment_date}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{dict.dashboard.recentPatients}</h2>
            <Link href="/dashboard/patients" className="text-sm font-semibold text-slate-700">Open -&gt;</Link>
          </div>
          <div className="space-y-3">
            {!loading && latestPatients.length === 0 ? <p className="text-sm text-slate-600">No patients found.</p> : null}
            {latestPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{patient.name}</span>
                <span className="text-slate-600">{patient.phone || patient.email || ""}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Latest reviews</h2>
            <Link href="/dashboard/reviews" className="text-sm font-semibold text-slate-700">Open -&gt;</Link>
          </div>
          <div className="space-y-3">
            {!loading && latestReviews.length === 0 ? <p className="text-sm text-slate-600">No reviews found.</p> : null}
            {latestReviews.map((review) => (
              <div key={review.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{review.user.name}</span>
                  <span className="text-amber-500">{"*".repeat(review.rating || 0)}</span>
                </div>
                <p className="mt-1 text-slate-600">{review.comment || review.doctor.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Latest messages</h2>
            <Link href="/dashboard/messages" className="text-sm font-semibold text-slate-700">Open -&gt;</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {!loading && latestMessages.length === 0 ? <p className="text-sm text-slate-600">No messages found.</p> : null}
            {latestMessages.map((message) => (
              <div key={message.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-slate-900">{message.name}</span>
                  <span className="text-slate-500">{message.email}</span>
                </div>
                <p className="mt-1 text-slate-600">{message.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
