"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AiDemoBadge from "@/components/AiDemoBadge";
import { AiApiError, chatWithBook } from "@/lib/ai-api";
import type { AiAvailability } from "@/lib/books-api";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type BookAIChatProps = {
  bookId: string;
  aiAvailability?: AiAvailability;
  isLegacyDemo?: boolean;
  exampleQuestion?: string;
  exampleResponse?: string;
};

function availabilityMessage(status?: AiAvailability): string | null {
  switch (status) {
    case "PROCESSING":
      return "AI-помощник готовит книгу к анализу. Попробуйте позже.";
    case "FAILED":
      return "AI-обработка этой книги не удалась. Загрузите PDF повторно или проверьте N8N.";
    case "UNAVAILABLE":
      return "AI пока недоступен для этой книги: нет обработанного PDF.";
    case "AVAILABLE":
      return null;
    default:
      return "AI пока недоступен для этой книги.";
  }
}

function mapChatError(err: unknown): string {
  if (err instanceof AiApiError) {
    if (err.code === "not_ready") {
      return "AI ещё не готов для этой книги. Проверьте статус обработки и попробуйте позже.";
    }
    if (err.code === "not_configured") {
      return "AI-сервис не настроен. Проверьте N8N env и webhook.";
    }
    if (err.code === "unavailable") {
      return "AI-сервис временно недоступен. Попробуйте повторить запрос.";
    }
    return err.message;
  }
  return "Не удалось получить ответ. Проверьте сеть и попробуйте ещё раз.";
}

export default function BookAIChat({
  bookId,
  aiAvailability,
  isLegacyDemo = false,
  exampleQuestion = "О чём основная идея книги?",
  exampleResponse = "Demo AI mode: подключите backend AI pipeline для анализа этой книги.",
}: BookAIChatProps) {
  const [messages, setMessages] = useState<Message[]>(() =>
    isLegacyDemo
      ? [
          { id: "1", role: "user", text: exampleQuestion },
          { id: "2", role: "assistant", text: exampleResponse },
        ]
      : [],
  );
  const [input, setInput] = useState("");
  const [sessionId] = useState(
    () => `book-${bookId}-${Date.now().toString(36)}`,
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const disabledReason = useMemo(() => {
    if (isLegacyDemo) return null;
    return availabilityMessage(aiAvailability);
  }, [isLegacyDemo, aiAvailability]);

  const chatDisabled = Boolean(disabledReason) || sending;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, sending, error]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || chatDisabled) return;

    const cleanText = text.trim();
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: "user", text: cleanText },
    ]);
    setInput("");
    setError(null);
    setLastFailedText(null);

    if (isLegacyDemo) {
      setSending(true);
      window.setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            text: "Demo AI mode: ответ сформирован локально. Реальный анализ появится после обработки PDF через backend и N8N.",
          },
        ]);
        setSending(false);
      }, 500);
      return;
    }

    setSending(true);
    try {
      const { answer } = await chatWithBook(bookId, {
        message: cleanText,
        sessionId,
      });
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-assistant`, role: "assistant", text: answer },
      ]);
    } catch (err) {
      setLastFailedText(cleanText);
      setError(mapChatError(err));
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm fade-in sm:p-8">
      <h2 className="text-lg font-semibold text-black sm:text-xl">
        Обсудите книгу с ИИ
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="text-sm text-gray-600">
          Задайте вопрос об идеях, героях или контексте произведения.
        </p>
        {isLegacyDemo ? <AiDemoBadge /> : null}
      </div>

      {disabledReason ? (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {disabledReason}
        </p>
      ) : null}

      {error ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          <p>{error}</p>
          {lastFailedText ? (
            <button
              type="button"
              onClick={() => void sendMessage(lastFailedText)}
              className="mt-2 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-red-800 ring-1 ring-red-200 hover:bg-red-100"
            >
              Повторить запрос
            </button>
          ) : null}
        </div>
      ) : null}

      <ChatMessages>
        {messages.length === 0 && !isLegacyDemo && !disabledReason ? (
          <p className="text-sm text-gray-500">
            Задайте первый вопрос о книге — ответ придёт от AI-помощника.
          </p>
        ) : null}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-black text-white"
                  : "border border-gray-200 bg-white text-black shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {sending ? (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
              AI думает...
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </ChatMessages>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            chatDisabled && disabledReason
              ? disabledReason
              : "Задайте вопрос о книге..."
          }
          disabled={(Boolean(disabledReason) && !isLegacyDemo) || sending}
          className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-black placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={chatDisabled}
          className="h-11 shrink-0 rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "..." : "Отправить"}
        </button>
      </form>
    </section>
  );
}

function ChatMessages({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex max-h-[320px] flex-col gap-3 overflow-y-auto rounded-2xl bg-gray-50 p-4">
      {children}
    </div>
  );
}
