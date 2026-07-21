import { api } from "@/lib/api";

export const paymentService = {
  async checkout(appointmentId: number) {
    const data = await api.post<{
      message: string;
      checkout_url: string;
    }>("/payments/checkout", {
      appointment_id: appointmentId,
    });

    return data;
  },
};