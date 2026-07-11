export interface ServiceItem {
  id: number;
  name: string;
  description?: string | null;
  price?: string | number | null;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
