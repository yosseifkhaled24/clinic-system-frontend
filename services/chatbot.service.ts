import api from "@/lib/axios";
import { unwrapResponse } from "./response";
import type { ChatbotReply, ChatbotRequestPayload } from "@/types/chatbot";

/** Gemini answers can take a while on long answers; cap generously. */
const CHATBOT_TIMEOUT_MS = 60_000;

export const chatbotService = {
  async ask(payload: ChatbotRequestPayload) {
    const response = await api.post("/chatbot", payload, {
      timeout: CHATBOT_TIMEOUT_MS,
    });
    return unwrapResponse<ChatbotReply>(response);
  },
};
