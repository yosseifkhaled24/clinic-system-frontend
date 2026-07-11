export interface Appointment {
  id: number;
  doctor: {
    id: number;
    name: string;
    specialty?: string | null;
  };
  patient: {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
  };
  queue_number: number;
  appointment_date: string;
  status: "pending" | "arrived" | "in_progress" | "completed" | "cancelled" | "no_show";
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AppointmentCreatePayload {
  doctor_id: number;
  appointment_date: string;
  notes?: string;
}

export interface AppointmentCreateResponse {
  message: string;
  queue_number: number;
  data: Appointment;
}
