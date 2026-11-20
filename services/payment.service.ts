import api from "@/lib/axios";
import { unwrapResponse } from "./response";

/**
 * SEC-06: honest payment state for a Stripe checkout session, read from
 * the backend (which reads Stripe server-side). The backend never marks
 * an appointment as paid from this call — only the signed webhook (or
 * the admin cash flow) may do that, so a browser redirect alone can
 * never claim payment succeeded.
 *
 *  - confirmed: the appointment is recorded as paid (webhook landed).
 *  - pending:   Stripe has not reported the session as paid yet, OR
 *               Stripe reports paid but the webhook has not been
 *               processed yet (delayed delivery).
 *  - failed:    the session expired / was never completed.
 */
export interface PaymentStatusResult {
  status: "confirmed" | "pending" | "failed";
  appointment_id?: number;
  appointment_status?: string;
  payment_method?: string | null;
  note?: string;
}

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

  /** Read-only status check — never marks anything as paid. */
  async status(sessionId: string) {
    const response = await api.get("/payments/status", {
      params: { session_id: sessionId },
    });

    return unwrapResponse<PaymentStatusResult>(response);
  },
};
