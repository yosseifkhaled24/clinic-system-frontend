export interface Doctor {
  id: number;
  name: string;
  specialty?: string | null;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  allow_reviews?: boolean;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
