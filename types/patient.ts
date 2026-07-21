export interface Patient {
  id: number;

  user_id?: number | null;

  name: string;
  phone: string;
  email?: string | null;

  gender?: "male" | "female" | null;

  date_of_birth?: string | null;

  address?: string | null;

  notes?: string | null;

  created_at?: string;
  updated_at?: string;
}