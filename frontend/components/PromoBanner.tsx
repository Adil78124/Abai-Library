import Link from "next/link";

export type PromoBannerProps = {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl?: string;
  tone?: "light" | "dark" | "gold";
  variant?: "classic" | "assistant" | "default";
};

const toneClasses: Record<NonNullable<PromoBannerProps["tone"]>, string> = {
  light: "bg-white text-black border border-gray-200",
  dark: "bg-black text-white",
  gold: "bg-gold text-black",
};

export default function PromoBanner({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  imageUrl,
  tone = "light",
  variant = "default",
}: PromoBannerProps) {
  const toneClass = toneClasses[tone];

  if (variant === "classic") {
    // Откройте классику Казахстана — тёмный баннер с книгой
    return (
      <section className="mt-12">
        <div className="relative flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-[#1F2A44] px-8 py-10 text-white shadow-sm sm:px-12 lg:flex-row lg:items-stretch lg:px-16 lg:py-12">
          {/* Текст слева */}
          <div className="relative z-10 flex flex-1 flex-col justify-center">
            <div className="mb-6 h-1 w-12 rounded-full bg-gold" />
            <h2 className="text-3xl font-semibold leading-snug sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 max-w-md text-sm text-white/80 sm:text-base">
                {subtitle}
              </p>
            )}
            <div className="mt-8">
              <Link
                href={ctaHref}
                className="inline-flex items-center rounded-xl bg-gold px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-gold-hover"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>

          {/* Композиция книги справа */}
          <div className="relative mt-10 hidden flex-1 items-center justify-center md:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,169,107,0.15)_0%,transparent_70%)]" />
            <div className="relative h-72 w-64 max-w-full">
              {/* Задняя «книга» */}
              <div className="absolute bottom-16 right-6 h-60 w-40 -rotate-6 overflow-hidden rounded-r-md border border-gold/20 bg-[#151D2E] shadow-sm">
                <div className="absolute inset-y-0 left-0 w-4 bg-gold/20" />
              </div>
              {/* Лист/манускрипт */}
              <div className="absolute right-16 top-6 h-40 w-56 rotate-12 rounded-sm border border-gray-200 bg-[#F4EBD0] p-6 text-[#1F2A44] shadow-sm">
                <div className="space-y-2 opacity-30">
                  <div className="h-2 w-full rounded bg-[#1F2A44]/40" />
                  <div className="h-2 w-3/4 rounded bg-[#1F2A44]/40" />
                  <div className="h-2 w-5/6 rounded bg-[#1F2A44]/40" />
                  <div className="h-2 w-1/2 rounded bg-[#1F2A44]/40" />
                </div>
              </div>
              {/* Передняя книга */}
              <div className="absolute bottom-6 right-0 h-72 w-44 rotate-3 rounded-r-lg border-2 border-[#D4AF37]/40 bg-[#151D2E] shadow-sm">
                <div className="absolute inset-0 flex items-center justify-center px-6">
                  <div className="flex flex-col items-center text-center text-white">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                      Classic
                    </span>
                    <div className="mt-2 h-px w-10 bg-[#D4AF37]/40" />
                    <span className="mt-3 text-[18px] leading-tight">
                      Қазақ Әдебиеті
                    </span>
                  </div>
                </div>
                <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "assistant") {
    // Баннер ИИ‑помощника с насыщенным navy и акцентом gold
    return (
      <section className="mt-12">
        <div className="relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-[#1F2A44] px-8 py-10 text-white shadow-sm sm:px-12 lg:flex-row lg:items-center lg:px-16 lg:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,169,107,0.1)_0%,rgba(31,42,68,0)_70%)]" />
          <div className="relative z-10 flex-1 space-y-5">
            <h2 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
              Используйте <span className="text-gold">ИИ‑помощника</span>{" "}
              для поиска книг
            </h2>
            {subtitle && (
              <p className="max-w-md text-sm text-white/80 sm:text-base">
                {subtitle}
              </p>
            )}
            <div className="pt-2">
              <Link
                href={ctaHref}
                className="group inline-flex items-center rounded-full bg-gold px-7 py-3 text-sm font-semibold text-black transition hover:bg-gold-hover"
              >
                <span>{ctaLabel}</span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-10 hidden flex-1 items-center justify-center lg:flex">
            <div className="absolute h-60 w-60 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative flex h-64 w-full max-w-md items-center justify-center">
              {/* Левый «карточный» UI блок */}
              <div className="animate-[float_4s_ease-in-out_infinite] absolute -translate-x-24 -translate-y-10 rounded-xl border border-white/20 bg-white/10 p-4 shadow-sm">
                <div className="mb-2 h-20 w-32 rounded-md bg-gold/20" />
                <div className="mb-1 h-2 w-24 rounded bg-white/50" />
                <div className="h-2 w-16 rounded bg-white/30" />
              </div>
              {/* Центральный AI узел */}
              <div className="relative flex flex-col items-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold/20 bg-[#1F2A44]/60 shadow-sm">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold">
                    <svg
                      className="h-8 w-8 text-[#1F2A44]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Правый «карточный» блок */}
              <div className="animate-[float_4s_ease-in-out_infinite] absolute translate-x-24 translate-y-10 rounded-xl border border-white/20 bg-white/10 p-4 shadow-sm [animation-delay:1.2s]">
                <div className="mb-2 h-24 w-36 rounded-md bg-gold/20" />
                <div className="mb-1 h-2 w-20 rounded bg-white/50" />
                <div className="h-2 w-10 rounded bg-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div
        className={`flex flex-col overflow-hidden rounded-3xl border border-gray-200 px-6 py-6 shadow-sm sm:px-8 lg:flex-row lg:items-center lg:px-10 lg:py-8 ${toneClass}`}
      >
        <div className="flex-1">
          <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 lg:max-w-md">{subtitle}</p>
          )}
          <div className="mt-5">
            <Link
              href={ctaHref}
              className="inline-flex items-center rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="mt-4 h-40 w-full rounded-2xl object-cover sm:h-44 lg:mt-0 lg:ml-8 lg:w-64"
          />
        )}
      </div>
    </section>
  );
}

