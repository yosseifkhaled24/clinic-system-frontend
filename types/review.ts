export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  /**
   * SEC-20: anonymized unless the caller is an admin or the review's
   * own owner — the backend then omits `user.id` and returns
   * `user.name: null`. Admin reads and the authenticated store/update
   * responses keep the full shape.
   */
  user: {
    id?: number;
    name?: string | null;
  };
  doctor: {
    id: number;
    name: string;
  };
  /**
   * Omitted entirely on anonymized (public) responses.
   */
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
