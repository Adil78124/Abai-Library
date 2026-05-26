"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  onSearch?: (q: string) => void;
  value?: string;
  onChange?: (q: string) => void;
  /** При submit без onSearch — переход в каталог с ?q= */
  redirectToCatalog?: boolean;
};

export default function SearchBar({
  placeholder = "Поиск по каталогу...",
  className = "",
  onSearch,
  value: controlledValue,
  onChange,
  redirectToCatalog = false,
}: SearchBarProps) {
  const router = useRouter();
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = (next: string) => {
    if (isControlled) onChange?.(next);
    else setInternalValue(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
      return;
    }
    if (redirectToCatalog) {
      const q = value.trim();
      router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm ${className}`}
      role="search"
    >
      <svg
        className="h-5 w-5 shrink-0 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-black placeholder:text-gray-500 focus:outline-none"
        aria-label="Поиск"
      />
      <span className="hidden rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500 sm:inline-flex">
        Enter
      </span>
    </form>
  );
}
