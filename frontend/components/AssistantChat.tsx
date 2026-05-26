"use client";

import { useState } from "react";
import AiDemoBadge from "@/components/AiDemoBadge";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type AssistantChatProps = {
  initialMessages?: Message[];
  placeholder?: string;
};

export default function AssistantChat({
  initialMessages = [],
  placeholder = "Напишите вопрос по книгам или каталогу...",
}: AssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Имитация ответа ассистента
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          text: "Демо-режим: ответ сгенерирован локально. Реальный ИИ-помощник будет доступен после интеграции с backend.",
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-3">
      <AiDemoBadge />
      <p className="text-sm text-gray-600">
        Demo AI mode: этот общий ассистент отвечает локально. Реальный AI
        подключён на страницах книг, когда `aiAvailability=AVAILABLE`.
      </p>
      <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden fade-in">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[320px] max-h-[480px] bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            Задайте вопрос — ИИ помощник ответит по каталогу и книгам.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={[
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start",
            ].join(" ")}
          >
            <div
              className={[
                "max-w-[85%] rounded-xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-200 text-black shadow-sm",
              ].join(" ")}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-gray-200 bg-white p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          aria-label="Сообщение"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-black px-5 py-3 text-white font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Отправить
        </button>
      </form>
      </div>
    </div>
  );
}
