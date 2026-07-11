export interface Patient {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  gender?: "male" | "female" | null;
  date_of_birth?: string | null;
  address?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
