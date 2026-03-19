export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverUrl: string;
  rating: number;
  reviewsCount?: number;
  genre: string;
  badge?: "available" | "popular" | "new";
  tags?: string[];
  year?: number;
  pages?: number;
  language?: string;
  publisher?: string;
  shortDescription?: string;
  about?: string;
  themes?: string[];
  context?: string;
  /** Имя файла PDF в папке pdfBooks */
  pdfPath?: string;
  /** true = показывать обложку-плейсхолдер (фон + название + автор) вместо картинки */
  coverPlaceholder?: boolean;
};

// Все книги с реальными PDF. Обложки: у английских — картинки из Public, у остальных — плейсхолдер (фон + название + автор).
export const books: Book[] = [
  {
    id: "1",
    slug: "slova-nazidaniya",
    title: "Абайдың қара сөздері",
    author: "Абай Кунанбаев",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 5.0,
    genre: "Философия",
    badge: "available",
    tags: ["Философия", "Классика"],
    shortDescription: "Классическое произведение о морали, обществе и человеке.",
    year: 1890,
    pages: 180,
    language: "Казахский",
    pdfPath: "Абайдың қара сөздері.pdf",
  },
  {
    id: "2",
    slug: "abai-danalyq-sozderi",
    title: "Абайдың даналық сөздері",
    author: "Абай Кунанбаев",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 4.9,
    genre: "Философия",
    badge: "available",
    tags: ["Философия"],
    shortDescription: "Философские мысли и афоризмы великого мыслителя.",
    year: 1890,
    pages: 150,
    language: "Казахский",
    pdfPath: "Абайдын даналык создеры.pdf",
  },
  {
    id: "3",
    slug: "olengder-abai",
    title: "Өлеңдер Абай",
    author: "Абай Кунанбаев",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 4.9,
    genre: "Поэзия",
    badge: "available",
    tags: ["Поэзия"],
    shortDescription: "Сборник стихов Абая о жизни, любви и обществе.",
    year: 1890,
    pages: 200,
    language: "Казахский",
    pdfPath: "ӨлеңдерАбай.pdf",
  },
  {
    id: "4",
    slug: "poemy-abai",
    title: "Поэмалар Абай",
    author: "Абай Кунанбаев",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 4.8,
    genre: "Поэзия",
    badge: "available",
    tags: ["Поэзия"],
    shortDescription: "Сборник поэм великого казахского поэта.",
    year: 1890,
    pages: 220,
    language: "Казахский",
    pdfPath: "ПоэмаларАбай.pdf",
  },
  {
    id: "5",
    slug: "abaiqa-arnau-olengder",
    title: "Абайға арнау өлеңдер",
    author: "Разные авторы",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 4.6,
    genre: "Поэзия",
    badge: "available",
    tags: ["Поэзия"],
    shortDescription: "Сборник стихов, посвящённых Абаю Кунанбаеву и его наследию.",
    year: 2000,
    pages: 250,
    language: "Казахский",
    pdfPath: "Абайға арнау өлеңдер.pdf",
  },
  {
    id: "6",
    slug: "audarmalar-abai",
    title: "Аудармалар Абай",
    author: "Абай Кунанбаев",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 4.7,
    genre: "Переводы",
    badge: "available",
    tags: ["Переводы", "Классика"],
    shortDescription: "Переводы произведений зарубежных авторов, выполненные Абаем.",
    year: 1895,
    pages: 200,
    language: "Казахский",
    pdfPath: "АудармаларАбай.pdf",
  },
  {
    id: "7",
    slug: "maken-qizdin-dauy",
    title: "Мәкен қыздың дауы",
    author: "Абай Кунанбаев",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 4.5,
    genre: "Поэзия",
    badge: "available",
    tags: ["Поэзия"],
    shortDescription: "Поэтическое произведение о судьбе и чувствах.",
    year: 1890,
    pages: 30,
    language: "Казахский",
    pdfPath: "Мәкен қыздың дауы (пьеса)Абай.pdf",
  },
  {
    id: "8",
    slug: "dvenadcat",
    title: "Двенадцать",
    author: "Александр Блок",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 4.6,
    genre: "Поэзия",
    badge: "popular",
    tags: ["Поэзия", "Классика"],
    shortDescription: "Поэма о революции и судьбе России.",
    year: 1918,
    pages: 50,
    language: "Русский",
    pdfPath: "ДвенадцатьАлексанлрБлок.pdf",
  },
  {
    id: "9",
    slug: "sbornik-stihov-blok",
    title: "Сборник стихов",
    author: "Александр Блок",
    coverUrl: "",
    coverPlaceholder: true,
    rating: 4.7,
    genre: "Поэзия",
    badge: "available",
    tags: ["Поэзия"],
    shortDescription: "Избранные стихотворения одного из крупнейших поэтов Серебряного века.",
    year: 1910,
    pages: 180,
    language: "Русский",
    pdfPath: "Сборник стиховАлександрБлок.pdf",
  },
  {
    id: "10",
    slug: "alice-adventures",
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    coverUrl: "/Alice-adventure.jpg",
    rating: 4.6,
    reviewsCount: 3200,
    genre: "Фэнтези",
    badge: "popular",
    tags: ["Фэнтези", "Сказка"],
    shortDescription: "Сказочное путешествие девочки Алисы в мир абсурда, логических парадоксов и необычных существ.",
    year: 1865,
    pages: 200,
    language: "English",
    pdfPath: "Alice's Adventures in Wonderland _ Project Gutenberg.pdf",
  },
  {
    id: "11",
    slug: "dracula",
    title: "Dracula",
    author: "Bram Stoker",
    coverUrl: "/Dracula.jpg",
    rating: 4.7,
    reviewsCount: 2100,
    genre: "Ужасы",
    badge: "popular",
    tags: ["Ужасы", "Классика"],
    shortDescription: "Готический роман о графе Дракуле и борьбе с тьмой.",
    year: 1897,
    pages: 400,
    language: "English",
    pdfPath: "Dracula _ Project Gutenberg.pdf",
  },
  {
    id: "12",
    slug: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    coverUrl: "/Frankestetion.jpg",
    rating: 4.7,
    reviewsCount: 1800,
    genre: "Фантастика",
    badge: "available",
    tags: ["Фантастика", "Драма"],
    shortDescription: "История учёного, создавшего жизнь и столкнувшегося с последствиями.",
    year: 1818,
    pages: 280,
    language: "English",
    pdfPath: "Frankenstein _ Project Gutenberg.pdf",
  },
  {
    id: "13",
    slug: "moby-dick",
    title: "Moby Dick",
    author: "Herman Melville",
    coverUrl: "/MobyDick.jpg",
    rating: 4.5,
    reviewsCount: 1500,
    genre: "Приключения",
    badge: "available",
    tags: ["Приключения", "Классика"],
    shortDescription: "История одержимости капитана Ахава белым китом.",
    year: 1851,
    pages: 600,
    language: "English",
    pdfPath: "Moby Dick; or The Whale _ Project Gutenberg.pdf",
  },
  {
    id: "14",
    slug: "pride-and-prejudice",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    coverUrl: "/Pride%20and%20Prejudice-L.jpg",
    rating: 4.8,
    reviewsCount: 4100,
    genre: "Роман",
    badge: "popular",
    tags: ["Роман", "Классика"],
    shortDescription: "Роман о любви, предрассудках и социальном статусе.",
    year: 1813,
    pages: 432,
    language: "English",
    pdfPath: "Pride and prejudice _ Project Gutenberg.pdf",
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

/** Порядок книг для каталога (демо): перемешаны языки и авторы */
const CATALOG_DISPLAY_ORDER: string[] = [
  "alice-adventures",
  "slova-nazidaniya",
  "dracula",
  "dvenadcat",
  "olengder-abai",
  "frankenstein",
  "abai-danalyq-sozderi",
  "pride-and-prejudice",
  "poemy-abai",
  "moby-dick",
  "sbornik-stihov-blok",
  "abaiqa-arnau-olengder",
  "audarmalar-abai",
  "maken-qizdin-dauy",
];

/** Книги в порядке для каталога (разнообразная последовательность) */
export function getCatalogDisplayOrder(): Book[] {
  const bySlug = new Map(books.map((b) => [b.slug, b]));
  const ordered: Book[] = [];
  for (const slug of CATALOG_DISPLAY_ORDER) {
    const book = bySlug.get(slug);
    if (book) ordered.push(book);
  }
  for (const b of books) {
    if (!ordered.includes(b)) ordered.push(b);
  }
  return ordered;
}

/** Популярные для блока «Популярные книги» (5–6 карточек) */
export function getPopularForCatalog(): Book[] {
  return getCatalogDisplayOrder().slice(0, 6);
}

/** Книги Абая для подборки (до 6) */
export function getAbaiBooksForCatalog(): Book[] {
  return books.filter((b) => b.author.includes("Абай") || b.slug.includes("abai")).slice(0, 6);
}

/** Зарубежная классика (англоязычные, до 5) */
export function getForeignClassicsForCatalog(): Book[] {
  return books.filter((b) => b.language === "English").slice(0, 5);
}

/** Поэзия и философия для подборки (до 6, разнообразно) */
export function getPoetryPhilosophyForCatalog(): Book[] {
  const pool = books.filter(
    (b) => b.genre === "Поэзия" || b.genre === "Философия" || b.tags?.includes("Поэзия") || b.tags?.includes("Философия")
  );
  const ordered = getCatalogDisplayOrder();
  const result: Book[] = [];
  for (const b of ordered) {
    if (pool.includes(b) && result.length < 6) result.push(b);
  }
  return result;
}

export function getPopularBooks(): Book[] {
  return books;
}

export function getMonthlyTopBooks(): Book[] {
  return [...books].reverse();
}

export function getBusinessTopBooks(): Book[] {
  return books.slice(0, 6);
}

export function getHistoryTopBooks(): Book[] {
  return books.slice(2, 8);
}

export function getRecommendedBooks(): Book[] {
  return books;
}

export function getRecentBooks(): Book[] {
  return books;
}
