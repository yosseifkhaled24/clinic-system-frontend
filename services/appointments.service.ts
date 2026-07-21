import api from "@/lib/axios";
import type {
  Appointment,
  AppointmentCreatePayload,
  AppointmentCreateResponse,
} from "@/types/appointment";
import { unwrapCollection, unwrapResponse } from "./response";

export const appointmentsService = {
  async getAll() {
    const response = await api.get("/appointments");
    return unwrapCollection<Appointment>(response);
  },

  async getById(id: number) {
    const response = await api.get(`/appointments/${id}`);
    return unwrapResponse<Appointment>(response);
  },

  async create(payload: AppointmentCreatePayload) {
    const response = await api.post("/appointments", payload);
    return unwrapResponse<AppointmentCreateResponse>(response);
  },

  async update(
  id: number,
  payload: AppointmentCreatePayload
) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null
    ) {
      formData.append(
        key,
        String(value)
      );
    }
  });

  formData.append("_method", "PATCH");

  const response = await api.post(
    `/appointments/${id}`,
    formData
  );

  return unwrapResponse<Appointment>(response);
},

  async updateStatus(id: number, status: string) {
    const response = await api.patch(`/appointments/${id}/status`, {
      status,
    });

    return unwrapResponse(response);
  },
   async updatePayment(
  id: number,
  paymentMethod:
    | "cash"
    | "visa"
    | "stripe"
    | "instapay"
    | "vodafone_cash"
) {
  return api.patch(`/appointments/${id}/payment`, {
    payment_method: paymentMethod,
  });
},

  async delete(id: number) {
    const response = await api.delete(`/appointments/${id}`);
    return unwrapResponse(response);
  },
};