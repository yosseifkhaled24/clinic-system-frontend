import api from "@/lib/axios";
import type { DoctorQueue, QueueResponse } from "@/types/queue";
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

function normalizeDoctorQueue(
  response: DoctorQueue
): DoctorQueue {
  return {
    doctor: response.doctor,
    ...normalizeQueue(response),
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

  /**
   * All-doctors overview for the queue control center: one entry per
   * doctor (ordered by name), each with the same {current, waiting,
   * finished} buckets the single-doctor endpoint returns.
   */
  async all() {
    const response = await api.get("/queue");

    const queues = unwrapResponse<DoctorQueue[]>(response);

    return (Array.isArray(queues) ? queues : []).map(
      normalizeDoctorQueue
    );
  },
};