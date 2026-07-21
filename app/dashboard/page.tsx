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
  service_id: "",
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
      const queueData = firstDoctor
  ? await queueService.today(firstDoctor.id).catch(() => emptyQueue)
  : emptyQueue;
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
  service_id: Number(appointmentForm.service_id),
  appointment_date: appointmentForm.appointment_date,
  notes: appointmentForm.notes,
});
      setActionMessage("Appointment created successfully.");
      setAppointmentForm({
  doctor_id: "",
  service_id: "",
  appointment_date: "",
  notes: "",
});
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
      {/* Hero */}

<section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">

  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

    <div>

      <p className="mb-2 text-sm uppercase tracking-[0.25em] text-sky-100">
        Clinic Dashboard
      </p>

      <h1 className="text-4xl font-bold">
        Welcome Back 👋
      </h1>

      <p className="mt-4 max-w-xl text-sky-100">
        Manage doctors, appointments, queue and clinic operations
        from one modern dashboard.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">

        <Link
          href="/dashboard/appointments"
          className="rounded-xl bg-white px-6 py-3 font-semibold text-sky-700 transition hover:scale-105"
        >
          Appointments
        </Link>

        <Link
          href="/dashboard/doctors"
          className="rounded-xl border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10"
        >
          Doctors
        </Link>

      </div>

    </div>

    <div className="grid grid-cols-2 gap-4">

      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

        <p className="text-sm text-sky-100">
          Today's Appointments
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {overview.appointments_today}
        </h2>

      </div>

      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

        <p className="text-sm text-sky-100">
          Waiting Queue
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {queue.waiting.length}
        </h2>

      </div>

      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

        <p className="text-sm text-sky-100">
          Messages
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {overview.messages_count}
        </h2>

      </div>

      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

        <p className="text-sm text-sky-100">
          Reviews
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          {overview.reviews_count}
        </h2>

      </div>

    </div>

   </div>

  </section>
{/* Statistics */}

<section className="mb-8">

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <p className="text-sm text-slate-500">
        Doctors
      </p>

      <h2 className="mt-3 text-4xl font-bold text-slate-900">
        {doctors.length}
      </h2>

      <p className="mt-3 text-sm text-sky-600">
        Registered doctors
      </p>

    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <p className="text-sm text-slate-500">
        Patients
      </p>

      <h2 className="mt-3 text-4xl font-bold text-slate-900">
        {patients.length}
      </h2>

      <p className="mt-3 text-sm text-emerald-600">
        Total patients
      </p>

    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <p className="text-sm text-slate-500">
        Appointments
      </p>

      <h2 className="mt-3 text-4xl font-bold text-slate-900">
        {appointments.length}
      </h2>

      <p className="mt-3 text-sm text-orange-600">
        All appointments
      </p>

    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <p className="text-sm text-slate-500">
        Reviews
      </p>

      <h2 className="mt-3 text-4xl font-bold text-slate-900">
        {reviews.length}
      </h2>

      <p className="mt-3 text-sm text-pink-600">
        Patient reviews
      </p>

    </div>

  </div>

</section>
{/* Queue + Today's Appointments */}

<section className="mb-8 grid gap-6 xl:grid-cols-3">

  {/* Queue */}

  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

    <div className="mb-6 flex items-center justify-between">

      <h2 className="text-xl font-bold">
        Queue
      </h2>

      <Link
        href="/dashboard/queue"
        className="text-sm font-semibold text-sky-600 hover:underline"
      >
        Open →
      </Link>

    </div>

    <div className="grid grid-cols-3 gap-4">

      <div className="rounded-2xl bg-slate-100 p-4 text-center">

        <p className="text-sm text-slate-500">
          Current
        </p>

        <h3 className="mt-2 text-2xl font-bold">
          {queue.current ? "#" + queue.current.queue_number : "--"}
        </h3>

      </div>

      <div className="rounded-2xl bg-yellow-50 p-4 text-center">

        <p className="text-sm text-yellow-700">
          Waiting
        </p>

        <h3 className="mt-2 text-2xl font-bold text-yellow-600">
          {queue.waiting.length}
        </h3>

      </div>

      <div className="rounded-2xl bg-green-50 p-4 text-center">

        <p className="text-sm text-green-700">
          Finished
        </p>

        <h3 className="mt-2 text-2xl font-bold text-green-600">
          {queue.finished.length}
        </h3>

      </div>

    </div>

  </div>

  {/* Today's Appointments */}

  <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

    <div className="mb-6 flex items-center justify-between">

      <h2 className="text-xl font-bold">
        Today's Appointments
      </h2>

      <Link
        href="/dashboard/appointments"
        className="text-sm font-semibold text-sky-600 hover:underline"
      >
        View All →
      </Link>

    </div>

    <div className="space-y-4">

      {appointments.slice(0, 5).map((appointment) => (

        <div
          key={appointment.id}
          className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
        >

          <div>

            <h3 className="font-semibold">
              {appointment.patient.name}
            </h3>

            <p className="text-sm text-slate-500">
              {appointment.doctor.name}
            </p>

          </div>

          <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">

            #{appointment.queue_number}

          </span>

        </div>

      ))}

      {appointments.length === 0 && (

        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">

          No appointments yet.

        </div>

      )}

    </div>

  </div>

</section>
{/* Recent Activity + Quick Actions */}

<section className="grid gap-6 lg:grid-cols-2">

  {/* Recent Activity */}

  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

    <div className="mb-6 flex items-center justify-between">

      <h2 className="text-xl font-bold">
        Recent Activity
      </h2>

      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
        Live
      </span>

    </div>

    <div className="space-y-4">

      <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-xl">
          👨‍⚕️
        </div>

        <div>

          <p className="font-semibold">
            {doctors.length} Doctors Registered
          </p>

          <p className="text-sm text-slate-500">
            Clinic medical team.
          </p>

        </div>

      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl">
          👥
        </div>

        <div>

          <p className="font-semibold">
            {patients.length} Patients
          </p>

          <p className="text-sm text-slate-500">
            Registered patients.
          </p>

        </div>

      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl">
          📅
        </div>

        <div>

          <p className="font-semibold">
            {appointments.length} Appointments
          </p>

          <p className="text-sm text-slate-500">
            Total appointments.
          </p>

        </div>

      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-xl">
          ⭐
        </div>

        <div>

          <p className="font-semibold">
            {reviews.length} Reviews
          </p>

          <p className="text-sm text-slate-500">
            Patient feedback.
          </p>

        </div>

      </div>

    </div>

  </div>

  {/* Quick Actions */}

  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="mb-6 text-xl font-bold">
      Quick Actions
    </h2>

    <div className="grid gap-4 sm:grid-cols-2">

      <Link
        href="/dashboard/doctors"
        className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-sky-500 hover:bg-sky-50"
      >
        <div className="text-3xl">👨‍⚕️</div>

        <h3 className="mt-4 font-bold">
          Doctors
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Manage doctors.
        </p>

      </Link>

      <Link
        href="/dashboard/patients"
        className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-50"
      >
        <div className="text-3xl">👥</div>

        <h3 className="mt-4 font-bold">
          Patients
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          View patients.
        </p>

      </Link>

      <Link
        href="/dashboard/appointments"
        className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-orange-500 hover:bg-orange-50"
      >
        <div className="text-3xl">📅</div>

        <h3 className="mt-4 font-bold">
          Appointments
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Open appointments.
        </p>

      </Link>

      <Link
        href="/dashboard/services"
        className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-purple-500 hover:bg-purple-50"
      >
        <div className="text-3xl">🩺</div>

        <h3 className="mt-4 font-bold">
          Services
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Clinic services.
        </p>

      </Link>

    </div>

  </div>

</section>
</DashboardLayout>
);
}