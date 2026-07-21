export interface QueuePatient {
  id: number;
  queue_number: number;
  appointment_date: string;
  status: string;
  notes?: string | null;

  patient: {
    id: number;
    name: string;
    phone?: string | null;
    email?: string | null;
  };
}

export interface QueueResponse {
  current: QueuePatient | null;
  waiting: QueuePatient[];
  finished: QueuePatient[];
}