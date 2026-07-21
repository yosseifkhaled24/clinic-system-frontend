export interface Appointment {
  id: number;

  doctor: {
    id: number;
    name: string;
    specialty?: string | null;
  }; 
   service: {
     id: number;
     name: string;
     price: number;
   };

  patient: {
    id: number;
    name: string;
    email?: string | null;
    phone?: string |null;
  };

  queue_number: number;

  appointment_date: string;

  status:
    | "pending"
    | "arrived"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";

  notes?: string | null;

  created_at?: string | null;

  updated_at?: string | null;
}

export interface AppointmentCreatePayload {
  doctor_id: number;

  service_id: number;

  appointment_date: string;

  status?:
    | "pending"
    | "arrived"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";

  notes?: string;

  // Existing Patient
  patient_id?: number;

  // New Patient
  name?: string;

  phone?: string;

  email?: string;

  gender?: "male" | "female";
}

export interface AppointmentCreateResponse {
  message: string;

  queue_number: number;

  data: Appointment;
}

export interface AppointmentStatusPayload {
  status:
    | "pending"
    | "arrived"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
}