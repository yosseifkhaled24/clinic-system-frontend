import type { Appointment } from "./appointment";

export interface QueueItem extends Omit<Appointment, "doctor"> {
  id: number;
}

export interface QueueResponse {
  current: QueueItem | null;
  waiting: QueueItem[];
  finished: QueueItem[];
}
