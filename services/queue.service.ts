import api from "@/lib/axios";
import type { QueueResponse } from "@/types/queue";
import { unwrapResponse } from "./response";

const emptyQueue: QueueResponse = {
  current: null,
  waiting: [],
  finished: [],
};

function normalizeQueue(
  response: QueueResponse
): QueueResponse {
  return {
    current: response.current ?? null,
    waiting: Array.isArray(response.waiting)
      ? response.waiting
      : [],
    finished: Array.isArray(response.finished)
      ? response.finished
      : [],
  };
}

export const queueService = {
  async today(doctorId: number) {
    const response = await api.get(`/queue/${doctorId}`);

    const queue = unwrapResponse<
      Partial<QueueResponse>
    >(response);

    return normalizeQueue({
      ...emptyQueue,
      ...queue,
    });
  },
};