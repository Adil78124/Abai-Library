type BookDescriptionProps = {
  about: string;
  themes: string[];
  context: string;
};

export default function BookDescription({
  about,
  themes,
  context,
}: BookDescriptionProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm fade-in sm:p-7">
      <div className="space-y-6 text-sm leading-relaxed text-gray-600 sm:text-base">
        <div>
          <h2 className="text-base font-semibold text-black sm:text-lg">
            О книге
          </h2>
          <p className="mt-2">{about}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-black sm:text-base">
            Основные темы
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {themes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-black sm:text-base">
            Исторический контекст
          </h3>
          <p className="mt-2">{context}</p>
        </div>
      </div>
    </section>
  );
}

