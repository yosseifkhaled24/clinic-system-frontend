export interface PatientHistoryResponse {
  patient: PatientHistoryPatient;
  statistics: PatientHistoryStatistics;
  history: PatientHistoryItem[];
}

export interface PatientHistoryPatient {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
}

export interface PatientHistoryStatistics {
  total_visits: number;
  completed_visits: number;
  cancelled_visits: number;
  no_show_visits: number;
  total_paid: number;
  last_visit: string | null;
}

export interface PatientHistoryItem {
  appointment_id: number;
  date: string;
  queue_number: number | null;

  doctor: {
    id: number | null;
    name: string | null;
    specialty: string | null;
  };

  service: {
    id: number | null;
    name: string | null;
  };

  price: number | null;

  payment: {
    status: string | null;
    method: string | null;
    paid_at: string | null;
  };

  appointment_status: string;

  review: {
    rating: number;
    comment: string;
  } | null;

  notes: string | null;
}   