export interface QueuePatient {
  id: number;
  queue_number: number;
  appointment_date: string;
  status: string;
  notes?: string | null;

  // A/B: the queue endpoint returns the raw appointment row, so the
  // consultation amount and payment state ride along for the Complete
  // dialog. service_price is a decimal cast, hence string | number.
  service_price: string | number;
  payment_status: "paid" | "unpaid";
  payment_method?: string | null;

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

/**
 * One doctor's queue from GET /api/queue — the exact per-queue structure
 * of QueueResponse wrapped with the doctor's identity.
 */
export interface DoctorQueue extends QueueResponse {
  doctor: {
    id: number;
    name: string;
    specialty?: string | null;
  };
}