import api from "@/lib/axios";
import type { QueueItem } from "@/types/queue";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const queueService = {
  async getToday(doctorId: number) {
    const response = await api.get(`/queue/${doctorId}`);
    return unwrapResponse<QueueItem[]>(response);
  },
};
