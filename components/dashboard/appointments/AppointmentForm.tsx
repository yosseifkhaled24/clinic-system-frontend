"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

import type { Doctor } from "@/types/doctor";
import type { Patient } from "@/types/patient";
import type { Service } from "@/types/service";

import type {
  Appointment,
  AppointmentCreatePayload,
} from "@/types/appointment";

interface AppointmentFormProps {
  doctors: Doctor[];
  patients: Patient[];
  services: Service[];

  initialData?: Appointment | null;

  isSubmitting: boolean;

  onSubmit: (
    data: AppointmentCreatePayload
  ) => void;

  onCancel: () => void;
}

export default function AppointmentForm({
  doctors,
  patients,
  services,
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const [doctorId, setDoctorId] =
    useState("");

  const [serviceId, setServiceId] =
    useState("");

  const [
    appointmentDate,
    setAppointmentDate,
  ] = useState("");

 const [status, setStatus] = useState<
  AppointmentCreatePayload["status"]
>("pending");

  const [notes, setNotes] =
    useState("");

  const [mode, setMode] = useState<
    "existing" | "new"
  >("existing");

  const [patientId, setPatientId] =
    useState("");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [gender, setGender] = useState<
  NonNullable<AppointmentCreatePayload["gender"]>
>("male");
      useEffect(() => {
    if (!initialData) {
      setDoctorId("");
      setServiceId("");
      setAppointmentDate("");
      setStatus("pending");
      setNotes("");

      setMode("existing");

      setPatientId("");

      setName("");
      setPhone("");
      setEmail("");
      setGender("male");

      return;
    }

    setDoctorId(
      initialData.doctor.id.toString()
    );

    setServiceId(
      initialData.service.id.toString()
    );

    setAppointmentDate(
      initialData.appointment_date
    );

    setStatus(
      initialData.status
    );

    setNotes(
      initialData.notes ?? ""
    );

    setMode("existing");

    setPatientId(
      initialData.patient.id.toString()
    );
  }, [initialData]);

  const handleSubmit = () => {
    const payload: AppointmentCreatePayload = {
      doctor_id: Number(doctorId),

      service_id: Number(serviceId),

      appointment_date:
        appointmentDate,

      status,

      notes,
    };

    if (mode === "existing") {
      payload.patient_id =
        Number(patientId);
    } else {
      payload.name = name;
      payload.phone = phone;
      payload.email = email;
      payload.gender = gender;
    }

    onSubmit(payload);
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <p className="mt-2 text-slate-500">
          {initialData
            ? "Update appointment information."
            : "Create a new appointment."}
        </p>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">
                {/* Patient Card */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-bold text-slate-800">
            Patient
          </h2>

          <div className="space-y-4">

            <button
              type="button"
              onClick={() => setMode("existing")}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                mode === "existing"
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-300 hover:border-sky-300"
              }`}
            >
              <h3 className="font-semibold text-slate-800">
                Existing Patient
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Choose a patient from the system.
              </p>

            </button>

            <button
              type="button"
              onClick={() => setMode("new")}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                mode === "new"
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-300 hover:border-sky-300"
              }`}
            >
              <h3 className="font-semibold text-slate-800">
                New Patient
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a patient while booking.
              </p>

            </button>

          </div>

        </div>

        {/* Appointment Information */}

        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="mb-8 text-xl font-bold text-slate-800">
            Appointment Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Doctor
              </label>

              <select
                value={doctorId}
                onChange={(e) =>
                  setDoctorId(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                <option value="">
                  Select Doctor
                </option>

                {doctors.map((doctor) => (

                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.name}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Service
              </label>

              <select
                value={serviceId}
                onChange={(e) =>
                  setServiceId(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                <option value="">
                  Select Service
                </option>

                {services.map((service) => (

                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </option>

                ))}

              </select>

            </div>
                        <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Appointment Date
              </label>

              <input
                type="date"
                value={appointmentDate}
                onChange={(e) =>
                  setAppointmentDate(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
  setStatus(
    e.target.value as AppointmentCreatePayload["status"]
  )
}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                <option value="pending">
                  Pending
                </option>

                <option value="arrived">
                  Arrived
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

                <option value="no_show">
                  No Show
                </option>

              </select>

            </div>

            {mode === "existing" ? (

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Patient
                </label>

                <select
                  value={patientId}
                  onChange={(e) =>
                    setPatientId(e.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  <option value="">
                    Select Patient
                  </option>

                  {patients.map((patient) => (

                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name} ({patient.phone})
                    </option>

                  ))}

                </select>

              </div>

            ) : (

              <>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Patient Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Gender
                  </label>

                  <select
                    value={gender}
                   onChange={(e) =>
  setGender(
    e.target.value as NonNullable<
      AppointmentCreatePayload["gender"]
    >
  )
}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  >
                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>

                  </select>

                </div>

              </>

            )}

          </div>

        </div>

      </div>
            {/* Notes */}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-xl font-bold text-slate-800">
          Notes
        </h2>

        <textarea
          rows={6}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Write appointment notes..."
          className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-4 text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />

        <p className="mt-3 text-sm text-slate-400">
          These notes are visible only to clinic staff.
        </p>

      </div>

      {/* Actions */}

      <div className="flex items-center justify-end gap-4">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Appointment"
            : "Save Appointment"}
        </Button>

      </div>

    </div>
  );
}