"use client";

import { useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type BookAIChatProps = {
  exampleQuestion?: string;
  exampleResponse?: string;
};

export default function BookAIChat({ exampleQuestion = "О чём основная идея книги?", exampleResponse = "В демо-режиме подключите ИИ‑backend для анализа этой книги." }: BookAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "user", text: exampleQuestion },
    { id: "2", role: "assistant", text: exampleResponse },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const user: Message = {
      id: String(Date.now()),
      role: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, user]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          text: "Это демо‑ответ. Подключите реальный ИИ‑backend, чтобы получать анализ и рекомендации по книге.",
        },
      ]);
    }, 700);
  };

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm fade-in sm:p-8">
      <h2 className="text-lg font-semibold text-black sm:text-xl">
        Обсудите книгу с ИИ
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Задайте вопрос об идеях, героях или контексте произведения — ИИ‑ассистент
        поможет разобраться.
      </p>
      <div className="mt-4 flex max-h-[320px] flex-col gap-3 overflow-y-auto rounded-2xl bg-gray-50 p-4">
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
                  : "bg-white border border-gray-200 text-black shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Задайте вопрос о книге..."
          className="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-3 text-sm text-black placeholder:text-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:bg-neutral-800 transition"
        >
          Отправить
        </button>
      </form>
    </section>
  );
}

