export interface ChatbotHistoryMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatbotRequestPayload {
  message: string;
  history?: ChatbotHistoryMessage[];
  language?: "en" | "ar";
}

export interface ChatbotReply {
  reply: string;
  model?: string;
  /**
   * null for normal replies; "emergency" when the backend's deterministic
   * safety screen short-circuited the message with escalation guidance
   * (the Gemini model was not consulted).
   */
  escalation?: "emergency" | null;
}

/** Message shape used inside the widget UI. */
export interface ChatbotUiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** "emergency" renders the red escalation bubble; otherwise undefined. */
  escalation?: "emergency" | null;
}
