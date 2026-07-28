"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ApiImage } from "@/components/ui/ApiImage";
import { useAuth } from "@/context/AuthContext";

import type { AuthUser } from "@/types/auth";
import type { Doctor } from "@/types/doctor";
import type { Appointment } from "@/types/appointment";
import { paymentService } from "@/services/payment.service";
import { getErrorMessage } from "@/lib/errors";
import { Button } from "@/components/ui/Button";

type ProfileContentProps = {
  profile: AuthUser | null;
  doctors: Doctor[];
  appointments: Appointment[];
};

export default function ProfileContent({
  profile,
  doctors,
  appointments,
}: ProfileContentProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  const handlePayment = async (appointmentId: number) => {
    try {
      const response = await paymentService.checkout(appointmentId);
      window.location.href = response.checkout_url;
    } catch (error) {
      alert(getErrorMessage(error, "Unable to start payment."));
    }
  };

  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl sm:rounded-[32px] border border-slate-200 bg-white p-5 sm:p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Account
            </h2>

            <button
              onClick={() => logout().then(() => router.push("/"))}
              className="rounded-xl bg-red-500 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-wrap gap-2 sm:gap-3 border-b border-slate-200 pb-5">
            {[
              { id: "profile", label: "Profile" },
              { id: "doctors", label: "Doctors" },
              { id: "appointments", label: "Appointments" },
              { id: "messages", label: "Messages" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
                <p className="text-sm text-slate-500">Name</p>
                <h3 className="mt-2 text-lg sm:text-xl font-bold text-slate-900">
                  {profile?.name}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
                <p className="text-sm text-slate-500">Email</p>
                <h3 className="mt-2 break-all text-lg sm:text-xl font-bold text-slate-900">
                  {profile?.email}
                </h3>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 sm:p-6">
                <p className="text-sm text-slate-500">Phone</p>
                <h3 className="mt-2 text-lg sm:text-xl font-bold text-slate-900">
                  {profile?.phone || "-"}
                </h3>
              </div>
            </div>
          )}

          {/* DOCTORS */}
          {activeTab === "doctors" && (
            <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
              {doctors.length === 0 ? (
                <p className="col-span-full text-center text-slate-500">
                  No doctors available.
                </p>
              ) : (
                doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <ApiImage
                      src={doctor.image_url}
                      alt={doctor.name}
                      className="h-60 w-full object-cover"
                      fallbackClassName="flex h-60 w-full items-center justify-center bg-slate-100"
                    />

                    <div className="p-6">
                      <p className="text-sm font-semibold text-sky-600">
                        {doctor.specialty || "Specialist"}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {doctor.name}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-slate-500 text-sm">
                        {doctor.bio}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* APPOINTMENTS */}
          {activeTab === "appointments" && (
            <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5">
              {appointments.length === 0 ? (
                <p className="text-center text-slate-500">
                  No appointments found.
                </p>
              ) : (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {appointment.doctor.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <span className="rounded-full bg-sky-100 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-sky-700">
                          {appointment.status}
                        </span>

                        {appointment.payment?.status === "unpaid" ? (
                          <Button
                            onClick={() => handlePayment(appointment.id)}
                            className="text-xs sm:text-sm px-3.5 py-1.5"
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-green-700">
                            Paid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <div className="mt-8 sm:mt-10 rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Messages
              </h3>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-500">
                Messages feature will be available soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}