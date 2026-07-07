import api from "@/lib/axios";
import type { ContactPayload } from "@/types/contact";

function unwrapResponse<T>(response: { data: T | { data: T } }) {
  return (response?.data && typeof response.data === "object" && "data" in response.data && response.data.data !== undefined
    ? (response.data as { data: T }).data
    : response.data) as T;
}

export const contactService = {
  async send(payload: ContactPayload) {
    const response = await api.post("/contact-messages", payload);
    return unwrapResponse(response);
  },
};
