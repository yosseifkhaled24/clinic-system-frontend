import api from "@/lib/axios";
import type { ContactMessage, ContactPayload } from "@/types/contact";
import { unwrapCollection, unwrapResponse } from "./response";

export const contactService = {
  async send(payload: ContactPayload) {
    const response = await api.post("/contact-messages", payload);
    return unwrapResponse(response);
  },

  async getAll() {
    const response = await api.get("/contact-messages");
    return unwrapCollection<ContactMessage>(response);
  },

  async delete(id: number) {
    const response = await api.delete(`/contact-messages/${id}`);
    return unwrapResponse(response);
  },
};
