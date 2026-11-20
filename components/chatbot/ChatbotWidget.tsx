"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  Bot,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "@/lib/i18n";
import { chatbotService } from "@/services/chatbot.service";
import type {
  ChatbotHistoryMessage,
  ChatbotReply,
  ChatbotUiMessage,
} from "@/types/chatbot";

/** Max turns of history sent to the backend (matches server-side cap). */
const MAX_HISTORY = 12;

let messageSeq = 0;
const nextId = () => `msg-${++messageSeq}`;

function mapChatError(
  err: unknown,
  errors: { network: string; rateLimited: string; unavailable: string; generic: string }
): string {
  const status = (err as { response?: { status?: number } })?.response?.status;

  if (status === undefined || status === 0) return errors.network;
  if (status === 429) return errors.rateLimited;
  if (status === 503) return errors.unavailable;
  return errors.generic;
}

/**
 * Floating clinic assistant widget (Gemini via POST /api/chatbot).
 * Responsive (full-width sheet on mobile, card on desktop), follows the
 * site's sky/slate design system, and supports EN/AR with RTL-aware layout.
 * Hidden on /dashboard so it never overlaps the admin sidebar.
 */
export function ChatbotWidget() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const dict = getDictionary(language);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotUiMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Last failed attempt, kept so "Retry" can replay it without duplicating
  // the user bubble already rendered in the list.
  const lastAttemptRef = useRef<{
    message: string;
    history: ChatbotHistoryMessage[];
  } | null>(null);

  const buildHistory = useCallback((): ChatbotHistoryMessage[] => {
    return messages.slice(-MAX_HISTORY).map((message) => ({
      role: message.role === "user" ? "user" : "model",
      text: message.content,
    }));
  }, [messages]);

  const deliver = useCallback(
    async (attempt: { message: string; history: ChatbotHistoryMessage[] }) => {
      setError(null);
      setIsLoading(true);

      try {
        const reply: ChatbotReply = await chatbotService.ask({
          message: attempt.message,
          history: attempt.history,
          language,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "assistant",
            content: reply.reply,
            escalation: reply.escalation ?? null,
          },
        ]);
      } catch (err) {
        setError(mapChatError(err, dict.chatbot.errors));
      } finally {
        setIsLoading(false);
      }
    },
    [dict, language]
  );

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || isLoading) return;

      // History is captured BEFORE the new user turn is appended.
      const attempt = { message: text, history: buildHistory() };
      lastAttemptRef.current = attempt;

      setError(null);
      setInput("");
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", content: text },
      ]);

      await deliver(attempt);
    },
    [buildHistory, deliver, isLoading]
  );

  const retry = useCallback(() => {
    const attempt = lastAttemptRef.current;
    if (!attempt || isLoading) return;

    // Drop the failed user bubble — send() replays the whole attempt.
    setMessages((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "user") {
          copy.splice(i, 1);
          break;
        }
      }
      return copy;
    });

    void deliver(attempt);
  }, [deliver, isLoading]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setInput("");
    setError(null);
    lastAttemptRef.current = null;
  }, []);

  // Auto-scroll to the newest message.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, isLoading, isOpen]);

  // Keep focus in the input when the panel opens.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  const suggestions = [
    { key: "services", text: dict.chatbot.suggestions.services },
    { key: "doctors", text: dict.chatbot.suggestions.doctors },
    { key: "booking", text: dict.chatbot.suggestions.booking },
    { key: "hours", text: dict.chatbot.suggestions.hours },
  ];

  // The welcome bubble is rendered straight from the dictionary, so it
  // always follows the active language without touching state.
  const showGreeting = messages.length === 0;
  const showSuggestions = messages.length === 0 && !isLoading;

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={dict.chatbot.open}
        className="fixed bottom-4 end-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/30 transition-all hover:-translate-y-0.5 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-20 z-[60] flex max-h-[75vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:end-4 sm:w-[390px] sm:max-h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-sky-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot size={20} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{dict.chatbot.title}</p>
                <p className="text-xs text-sky-100">{dict.chatbot.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                aria-label={dict.chatbot.newChat}
                title={dict.chatbot.newChat}
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/20"
              >
                <RotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={dict.chatbot.close}
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {showGreeting && (
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm leading-relaxed text-slate-800"
                  dir="auto"
                >
                  {dict.chatbot.welcome}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const isEmergency = message.escalation === "emergency";

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-sky-600 text-white"
                        : isEmergency
                          ? "border border-red-300 bg-red-50 text-red-900"
                          : "border border-slate-200 bg-slate-50 text-slate-800"
                    }`}
                    dir="auto"
                  >
                    {isEmergency && (
                      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-red-700">
                        <AlertTriangle size={13} className="shrink-0" />
                        {dict.chatbot.emergencyBadge}
                      </span>
                    )}
                    {message.content}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* Suggested questions */}
            {showSuggestions && (
              <div className="space-y-2 pt-1">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Sparkles size={14} />
                  {dict.chatbot.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.key}
                      type="button"
                      onClick={() => void send(suggestion.text)}
                      className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-start text-xs font-medium text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error + retry */}
            {error && (
              <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-1.5 font-semibold underline underline-offset-2 hover:text-red-900"
                  >
                    {dict.chatbot.retry}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white px-3 py-3"
          >
            <div className="flex items-end gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={dict.chatbot.placeholder}
                maxLength={2000}
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
              <button
                type="submit"
                disabled={isLoading || input.trim() === ""}
                aria-label={dict.chatbot.send}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </div>
            <p className="mt-2 px-1 text-center text-[11px] leading-snug text-slate-400">
              {dict.chatbot.disclaimer}
            </p>
          </form>
        </div>
      )}
    </>
  );
}
