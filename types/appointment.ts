export interface Appointment {
  id: number;
  title: string;
  date: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  doctor_id?: number;
  appointment_date?: string;
  notes?: string;
}
