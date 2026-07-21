"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

import { patientsService } from "@/services/patients.service";

import type { PatientHistoryResponse } from "@/types/patient-history";

import { getErrorMessage } from "@/lib/errors";

export default function PatientHistoryPage() {
  const router = useRouter();
  const params = useParams();

  const patientId = Number(params.id);
  console.log("params:", params);
console.log("id:", params.id);
console.log("patientId:", patientId);

  const [data, setData] =
    useState<PatientHistoryResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setIsLoading(true);

      const response =
        await patientsService.getHistory(patientId);

      setData(response);

      setError("");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to load patient history."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout
        title="Patient History"
        description="Loading..."
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          Loading patient history...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout
        title="Patient History"
        description="History"
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-600">
          {error || "Patient not found."}
        </div>
      </DashboardLayout>
    );
  }

  const { patient, statistics, history } = data;
  return (
  <DashboardLayout
    title="Patient History"
    description="Complete patient medical history"
  >
    <div className="mx-auto max-w-7xl space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">
            Patient History
          </h1>

          <p className="mt-2 text-slate-500">
            Complete medical history and appointments.
          </p>

        </div>

        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          ← Back
        </Button>

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">

          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-sky-100 text-5xl">
            👤
          </div>

          <div className="grid flex-1 gap-6 md:grid-cols-2">

            <div>

              <p className="text-sm text-slate-500">
                Full Name
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {patient.name}
              </h2>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Phone
              </p>

              <p className="mt-1 text-lg font-medium">
                {patient.phone || "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="mt-1 text-lg">
                {patient.email || "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Gender
              </p>

              <p className="mt-1 text-lg capitalize">
                {patient.gender || "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Birth Date
              </p>

              <p className="mt-1 text-lg">
                {patient.date_of_birth || "-"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Address
              </p>

              <p className="mt-1 text-lg">
                {patient.address || "-"}
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Total Visits"
          value={statistics.total_visits}
        />

        <StatCard
          title="Completed"
          value={statistics.completed_visits}
        />

        <StatCard
          title="Cancelled"
          value={statistics.cancelled_visits}
        />

        <StatCard
          title="No Show"
          value={statistics.no_show_visits}
        />

        <StatCard
          title="Total Paid"
          value={`${statistics.total_paid} EGP`}
        />

        <StatCard
          title="Last Visit"
          value={statistics.last_visit ?? "-"}
        />

      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-8 text-2xl font-bold text-slate-900">
          Appointment History
        </h2>

        <div className="space-y-6">

          {history.length === 0 && (

            <div className="py-20 text-center text-slate-500">

              <div className="text-6xl">
                📄
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                No history found
              </h3>

            </div>

          )}

          {history.map((visit) => (

            <div
              key={visit.appointment_id}
              className="rounded-2xl border border-slate-200 p-6 transition hover:border-sky-200 hover:bg-sky-50/30"
            >

              <div className="flex flex-col justify-between gap-6 lg:flex-row">

                <div className="space-y-3">

                  <h3 className="text-xl font-bold text-slate-900">
                    {visit.service.name}
                  </h3>

                  <p className="text-slate-600">
                    👨‍⚕️ {visit.doctor.name}
                  </p>

                  <p className="text-slate-600">
                    🩺 {visit.doctor.specialty}
                  </p>

                  <p className="text-slate-600">
                    📅 {visit.date}
                  </p>

                  <p className="text-slate-600">
                    🎫 Queue #{visit.queue_number}
                  </p>

                </div>

                <div className="space-y-3 text-right">

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    {visit.appointment_status}
                  </span>

                  <p className="font-semibold">
                    {visit.price} EGP
                  </p>

                  <p>
                    Payment:
                    {" "}
                    {visit.payment.status}
                  </p>

                  <p>
                    Method:
                    {" "}
                    {visit.payment.method}
                  </p>

                </div>

              </div>

              {visit.review && (

                <div className="mt-6 rounded-2xl bg-yellow-50 p-5">

                  <h4 className="font-semibold">
                    ⭐ {visit.review.rating}/5
                  </h4>

                  <p className="mt-2 text-slate-600">
                    {visit.review.comment}
                  </p>

                </div>

              )}

              {visit.notes && (

                <div className="mt-5 rounded-2xl bg-slate-50 p-5">

                  <h4 className="font-semibold">
                    Notes
                  </h4>

                  <p className="mt-2 text-slate-600">
                    {visit.notes}
                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>

  </DashboardLayout>
);
function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="mt-3 text-4xl font-bold text-slate-900">
        {value}
      </h3>
    </div>
  );
}}