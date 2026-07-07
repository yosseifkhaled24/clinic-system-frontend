"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { appointmentsService } from "@/services/appointments.service";
import type { Appointment } from "@/types/appointment";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    appointmentsService.getAll().then((response) => {
      const list = Array.isArray(response) ? response : (response as { data?: Appointment[] }).data || [];
      setAppointments(list);
    });
  }, []);

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold text-slate-900">My appointments</h1>
      <div className="mt-8 space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{appointment.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{appointment.date}</p>
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
