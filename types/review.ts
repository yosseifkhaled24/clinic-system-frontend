export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  user: {
    id: number;
    name: string;
  };
  doctor: {
    id: number;
    name: string;
  };
  appointment?: {
    id: number;
    appointment_date: string;
  };
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ReviewCreatePayload {
  doctor_id: number;
  appointment_id: number;
  rating: number;
  comment?: string;
}
