import api from "@/lib/axios";
import { unwrapResponse } from "./response";

export const paymentService = {
  async checkout(appointmentId: number) {
    const response = await api.post("/payments/checkout", {
      appointment_id: appointmentId,
    });

    return unwrapResponse<{
      message: string;
      checkout_url: string;
    }>(response);
  },
};