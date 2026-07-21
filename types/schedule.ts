export interface Schedule {
  id: number;

  doctor: {
    id: number;
    name: string;
  };

  day: string;

  start_time: string;

  end_time: string;

  is_available: boolean;

  max_patients: number;

  created_at?: string;

  updated_at?: string;
}

export interface SchedulePayload {
  doctor_id: number;

  day: string;

  start_time: string;

  end_time: string;

  is_available: boolean;

  max_patients: number;
}