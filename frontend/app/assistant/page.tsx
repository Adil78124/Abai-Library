import AssistantChat from "@/components/AssistantChat";

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-black sm:text-3xl">ИИ помощник</h1>
      <p className="mt-2 text-gray-600">
        Задайте вопрос по каталогу, книгам или произведениям Абая.{" "}
        <span className="text-amber-800">
          AI-помощник находится в демо-режиме.
        </span>
      </p>
      <div className="mt-8">
        <AssistantChat placeholder="Напишите вопрос по книгам или каталогу..." />
      </div>
    </div>
  );
}
