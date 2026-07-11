"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { getErrorMessage } from "@/lib/errors";
import { appointmentsService } from "@/services/appointments.service";
import type { Appointment } from "@/types/appointment";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    appointmentsService.getAll().then((response) => {
      setAppointments(response);
    }).catch((error) => {
      setError(getErrorMessage(error, "Unable to load appointments."));
      setAppointments([]);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold text-slate-900">My appointments</h1>
      <div className="mt-8 space-y-4">
        {isLoading ? <p className="text-sm text-slate-600">Loading...</p> : null}
        {!isLoading && error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {!isLoading && !error && appointments.length === 0 ? <p className="text-sm text-slate-600">No appointments found.</p> : null}
        {appointments.map((appointment) => (
          <div key={appointment.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{appointment.doctor.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{appointment.appointment_date}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
