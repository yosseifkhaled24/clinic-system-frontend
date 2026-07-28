"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/errors";

import { appointmentsService } from "@/services/appointments.service";
import { paymentService } from "@/services/payment.service";

import type { Appointment } from "@/types/appointment";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadInitial = () => {
      setIsLoading(true);

      appointmentsService
        .getAll()
        .then((response) => {
          if (!isMounted) return;
          setAppointments(response);
        })
        .catch((error) => {
          if (!isMounted) return;
          setError(getErrorMessage(error, "Unable to load appointments."));
          setAppointments([]);
        })
        .finally(() => {
          if (!isMounted) return;
          setIsLoading(false);
        });
    };

    const refresh = () => {
      appointmentsService
        .getAll()
        .then((response) => {
          if (!isMounted) return;
          setAppointments(response);
          setError("");
        })
        .catch(() => {
          // Preserve current appointments while background refresh fails.
        });
    };

    loadInitial();

    const interval = setInterval(refresh, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handlePayment = async (appointmentId: number) => {
    try {
      const response = await paymentService.checkout(appointmentId);

      window.location.href = response.checkout_url;
    } catch (error) {
      alert(getErrorMessage(error, "Unable to start payment."));
    }
  };

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold text-slate-900">
        My Appointments
      </h1>

      <div className="mt-8 space-y-4">
        {isLoading && (
          <p className="text-sm text-slate-600">
            Loading...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-sm text-rose-600">
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          appointments.length === 0 && (
            <p className="text-sm text-slate-600">
              No appointments found.
            </p>
          )}

        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {appointment.doctor.name}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {appointment.appointment_date}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Queue: {appointment.queue_number}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {appointment.status}
                </span>

                {appointment.payment?.status === "unpaid" ? (
                  <Button
                    onClick={() =>
                      handlePayment(appointment.id)
                    }
                  >
                    Pay Now
                  </Button>
                ) : (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Paid
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}