import api from "@/lib/axios";
import type { QueueItem, QueueResponse } from "@/types/queue";
import { unwrapResponse } from "./response";

const emptyQueue: QueueResponse = {
  current: null,
  waiting: [],
  finished: [],
};

function normalizeQueue(response: QueueResponse): QueueResponse {
  return {
    current: response.current ?? null,
    waiting: Array.isArray(response.waiting) ? response.waiting : [],
    finished: Array.isArray(response.finished) ? response.finished : [],
  };
}

export const queueService = {
  async getToday(doctorId: number) {
    const response = await api.get(`/queue/${doctorId}`);
    const queue = unwrapResponse<Partial<QueueResponse> & { waiting?: QueueItem[]; finished?: QueueItem[] }>(response);
    return normalizeQueue({ ...emptyQueue, ...queue });
  },
};
