import api from "@/lib/axios";

import type {
  Schedule,
  SchedulePayload,
} from "@/types/schedule";

import {
  unwrapCollection,
  unwrapResponse,
} from "./response";

export const schedulesService = {
  async getAll() {
    const response = await api.get("/schedules");

    return unwrapCollection<Schedule>(response);
  },

  async getByDoctor(doctorId: number) {
    const response = await api.get(
      `/doctors/${doctorId}/schedules`
    );

    return unwrapCollection<Schedule>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/schedules/${id}`);

    return unwrapResponse<Schedule>(response);
  },

  async create(payload: SchedulePayload) {
    const response = await api.post(
      "/schedules",
      payload
    );

    return unwrapResponse<Schedule>(response);
  },

  async update(
    id: number,
    payload: SchedulePayload
  ) {
    const response = await api.patch(
      `/schedules/${id}`,
      payload
    );

    return unwrapResponse<Schedule>(response);
  },

  async delete(id: number) {
    const response = await api.delete(
      `/schedules/${id}`
    );

    return unwrapResponse(response);
  },
};