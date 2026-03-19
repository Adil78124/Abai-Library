export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-black shadow-sm fade-in">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=1600")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
            наследие и будущее
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Цифровое наследие Абая
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
            Объединяем классическую литературу, философскую мысль великого
            мыслителя и современные технологии искусственного интеллекта для
            сохранения культуры в цифровую эпоху.
          </p>
        </div>
      </section>

      {/* LAYOUT */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* LEFT / CONTENTS */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                Содержание
              </span>
            </div>
            <nav className="mt-3 space-y-2 text-sm">
              <a className="block text-gray-700 hover:text-black" href="#about">
                О библиотеке
              </a>
              <a className="block text-gray-700 hover:text-black" href="#principles">
                Принципы коллекции
              </a>
              <a className="block text-gray-700 hover:text-black" href="#mission">
                Миссия проекта
              </a>
              <a className="block text-gray-700 hover:text-black" href="#ai">
                Роль ИИ в чтении
              </a>
              <a className="block text-gray-700 hover:text-black" href="#how">
                Как пользоваться
              </a>
              <a
                className="block text-gray-700 hover:text-black"
                href="#benefits"
              >
                Преимущества
              </a>
              <a className="block text-gray-700 hover:text-black" href="#faq">
                FAQ
              </a>
              <a className="block text-gray-700 hover:text-black" href="#roadmap">
                План развития
              </a>
            </nav>
          </div>

          <div className="rounded-2xl bg-black p-4 text-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C6A96B]/15 text-[#C6A96B]">
                <span className="text-lg leading-none">"</span>
              </div>
              <div>
                <p className="text-sm leading-relaxed text-white/85">
                  «Абай — это голос разума, который учит слушать себя и
                  оставаться человеком в меняющемся мире».
                </p>
                <p className="mt-2 text-[11px] font-medium text-[#C6A96B]">
                  — Abai Library
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT / MAIN */}
        <main className="space-y-8">
          {/* ABOUT */}
          <section
            id="about"
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <span>О библиотеке</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              Библиотека Абая — это не просто хранилище файлов, а уникальное
              цифровое пространство, созданное для глубокого погружения в
              литературное наследие. Мы стремимся сделать академические знания
              доступными для каждого, пользуясь инновационными подходами к чтению
              и анализу текстов.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Здесь можно не только читать произведения, но и собирать собственные
              списки, сохранять цитаты, возвращаться к важным фрагментам и открывать
              новые смыслы через тематические подборки. Мы строим интерфейс вокруг
              чтения: без лишнего шума, с ясной типографикой и быстрым поиском.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Проект ориентирован на студентов, исследователей и всех, кому важны
              культура и история: от знакомства с Абаем до системного изучения
              контекста и влияния его идей на современную мысль.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 p-5 shadow-sm">
                <p className="text-xs font-semibold text-black">Обширный фонд</p>
                <p className="mt-2 text-sm text-gray-600">
                  Тысячи оцифрованных произведений, редких изданий и критики в
                  одном месте.
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-5 shadow-sm">
                <p className="text-xs font-semibold text-black">Доступность 24/7</p>
                <p className="mt-2 text-sm text-gray-600">
                  Вся коллекция всегда рядом: доступ из любой точки мира с
                  любого устройства.
                </p>
              </div>
            </div>
          </section>

          {/* PRINCIPLES */}
          <section
            id="principles"
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <span>Принципы коллекции</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {[
                {
                  title: "Достоверность",
                  desc: "Опираемся на проверенные источники и редакторские принципы, чтобы тексты оставались точными и единообразными.",
                },
                {
                  title: "Контекст",
                  desc: "Добавляем справки: исторический фон, темы, связанные произведения и материалы для погружения.",
                },
                {
                  title: "Удобство чтения",
                  desc: "Интерфейс подстроен под чтение: ясная структура, быстрые переходы, заметки и сохранение прогресса.",
                },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl bg-gray-50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-black">{c.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 shadow-sm">
              <p className="text-sm text-gray-600">
                Мы делаем ставку на «витринную» подачу: подборки и топ‑разделы
                помогают быстро выбрать, что читать дальше — будь то первые шаги
                с Абаем или тематический маршрут по идеям и жанрам.
              </p>
            </div>
          </section>

          {/* MISSION */}
          <section
            id="mission"
            className="rounded-3xl bg-gray-50 p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <span>Миссия проекта</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              Наша главная цель — возродить интерес к мудрости Абая, сделать его
              наследие актуальным и понятным сегодня, служа моральным и
              интеллектуальным ориентиром для новых поколений.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold text-black">Для кого</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>Школьники и студенты — быстрый вход в классику.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>Исследователи — контекст, заметки и цитаты.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>Читатели — подборки и рекомендации.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold text-black">Как мы измеряем пользу</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>Понятность: краткие справки и словари терминов.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>Доступность: чтение на любых устройствах.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>Возврат: избранное, прогресс и личные подборки.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Просвещение", "Цифровизация", "Аналитика"].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* AI ROLE */}
          <section
            id="ai"
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <span>Роль ИИ в чтении</span>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
              <div>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  Мы интегрируем нейросети для улучшения читательского опыта:
                  подсказки по смыслу, объяснение контекста и персональные
                  рекомендации помогают сделать сложные тексты ближе и понятнее.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                  Важно: ИИ‑функции — это инструмент, а не «замена чтения». Мы
                  используем их для навигации по смыслу: подсветить тему, дать
                  краткую справку, предложить маршрут чтения и помочь найти точную
                  цитату.
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>
                      Умная аннотация: кратко о сути без потери смысла.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>
                      Семантический поиск: найдите нужную цитату, тему или
                      персонажа.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>
                      Маршруты чтения: рекомендации «с чего начать» и что читать
                      дальше.
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4 shadow-sm">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-900 to-gray-600 shadow-sm" />
              </div>
            </div>
          </section>

          {/* HOW TO USE */}
          <section
            id="how"
            className="rounded-3xl bg-gray-50 p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <span>Как пользоваться</span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Найдите книгу",
                  desc: "Воспользуйтесь поиском по названию, автору, жанру или ключевым темам.",
                },
                {
                  step: "02",
                  title: "Сохраните маршрут",
                  desc: "Добавляйте книги в избранное и собирайте подборки под задачу или настроение.",
                },
                {
                  step: "03",
                  title: "Читайте глубже",
                  desc: "Сохраняйте цитаты, возвращайтесь к заметкам и используйте подсказки ИИ для контекста.",
                },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-gold">{s.step}</div>
                  <h3 className="mt-2 text-sm font-semibold text-black">{s.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* BENEFITS */}
          <section id="benefits" className="pt-1">
            <h2 className="text-center text-lg font-semibold text-black sm:text-xl">
              Преимущества цифровой библиотеки
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Сохранение оригиналов",
                  desc: "Переводим редкие издания в цифровой формат и бережно храним их для будущих поколений.",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path
                        d="M7 3h10a2 2 0 012 2v16l-7-3-7 3V5a2 2 0 012-2z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Сообщество исследователей",
                  desc: "Инструменты для совместного изучения: заметки, цитаты и подборки для обучения и исследования.",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path
                        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 11a4 4 0 100-8 4 4 0 000 8z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23 21v-2a4 4 0 00-3-3.87"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 3.13a4 4 0 010 7.75"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Мгновенный поиск",
                  desc: "Поиск по темам, цитатам и именам в каталоге — быстрее, чем в бумажной библиотеке.",
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="rounded-3xl bg-white p-6 text-center shadow-sm"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 text-gray-900">
                    {b.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-black">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <span>FAQ</span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                {
                  q: "Это настоящая библиотека или демо?",
                  a: "Сейчас это витрина интерфейса. Данные и функции можно расширять: подключить бэкенд, авторизацию и полноценный каталог.",
                },
                {
                  q: "Можно ли использовать ИИ для анализа?",
                  a: "Да — в формате подсказок и навигации по смыслу: резюме, темы, контекст, рекомендации. В демо показан интерфейс без реального ИИ.",
                },
                {
                  q: "Будут ли аудиокниги и курсы?",
                  a: "Это в планах: аудиоверсии, маршруты чтения и образовательные подборки по темам.",
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl bg-gray-50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-black">{item.q}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ROADMAP */}
          <section
            id="roadmap"
            className="rounded-3xl bg-gray-50 p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              <span>План развития</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {[
                {
                  t: "Ближайшее",
                  d: "Расширение каталога, больше подборок и улучшенный поиск по фильтрам.",
                },
                {
                  t: "Далее",
                  d: "Аккаунт читателя: прогресс чтения, избранное, персональные рекомендации.",
                },
                {
                  t: "Позже",
                  d: "Подключение реального ИИ‑анализа, аудиокниги и обучающие маршруты.",
                },
              ].map((r) => (
                <div key={r.t} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-black">{r.t}</h3>
                  <p className="mt-2 text-sm text-gray-600">{r.d}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
