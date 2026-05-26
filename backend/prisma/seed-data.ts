/**
 * Каталог для seed — соответствует `frontend/data/books.ts` (без импорта из frontend).
 */
export type SeedBook = {
  slug: string;
  title: string;
  author: string;
  description?: string;
  language?: string;
  genre?: string;
  tags?: string[];
  image?: string;
  file?: string;
};

export const SEED_BOOKS: SeedBook[] = [
  {
    slug: 'slova-nazidaniya',
    title: 'Абайдың қара сөздері',
    author: 'Абай Кунанбаев',
    description: 'Классическое произведение о морали, обществе и человеке.',
    language: 'Казахский',
    genre: 'Философия',
    tags: ['Философия', 'Классика'],
    file: 'Абайдың қара сөздері.pdf',
  },
  {
    slug: 'abai-danalyq-sozderi',
    title: 'Абайдың даналық сөздері',
    author: 'Абай Кунанбаев',
    description: 'Философские мысли и афоризмы великого мыслителя.',
    language: 'Казахский',
    genre: 'Философия',
    tags: ['Философия'],
    file: 'Абайдын даналык создеры.pdf',
  },
  {
    slug: 'olengder-abai',
    title: 'Өлеңдер Абай',
    author: 'Абай Кунанбаев',
    description: 'Сборник стихов Абая о жизни, любви и обществе.',
    language: 'Казахский',
    genre: 'Поэзия',
    tags: ['Поэзия'],
    file: 'ӨлеңдерАбай.pdf',
  },
  {
    slug: 'poemy-abai',
    title: 'Поэмалар Абай',
    author: 'Абай Кунанбаев',
    description: 'Сборник поэм великого казахского поэта.',
    language: 'Казахский',
    genre: 'Поэзия',
    tags: ['Поэзия'],
    file: 'ПоэмаларАбай.pdf',
  },
  {
    slug: 'abaiqa-arnau-olengder',
    title: 'Абайға арнау өлеңдер',
    author: 'Разные авторы',
    description: 'Сборник стихов, посвящённых Абаю Кунанбаеву и его наследию.',
    language: 'Казахский',
    genre: 'Поэзия',
    tags: ['Поэзия'],
    file: 'Абайға арнау өлеңдер.pdf',
  },
  {
    slug: 'audarmalar-abai',
    title: 'Аудармалар Абай',
    author: 'Абай Кунанбаев',
    description: 'Переводы произведений зарубежных авторов, выполненные Абаем.',
    language: 'Казахский',
    genre: 'Переводы',
    tags: ['Переводы', 'Классика'],
    file: 'АудармаларАбай.pdf',
  },
  {
    slug: 'maken-qizdin-dauy',
    title: 'Мәкен қыздың дауы',
    author: 'Абай Кунанбаев',
    description: 'Поэтическое произведение о судьбе и чувствах.',
    language: 'Казахский',
    genre: 'Поэзия',
    tags: ['Поэзия'],
    file: 'Мәкен қыздың дауы (пьеса)Абай.pdf',
  },
  {
    slug: 'dvenadcat',
    title: 'Двенадцать',
    author: 'Александр Блок',
    description: 'Поэма о революции и судьбе России.',
    language: 'Русский',
    genre: 'Поэзия',
    tags: ['Поэзия', 'Классика'],
    file: 'ДвенадцатьАлексанлрБлок.pdf',
  },
  {
    slug: 'sbornik-stihov-blok',
    title: 'Сборник стихов',
    author: 'Александр Блок',
    description:
      'Избранные стихотворения одного из крупнейших поэтов Серебряного века.',
    language: 'Русский',
    genre: 'Поэзия',
    tags: ['Поэзия'],
    file: 'Сборник стиховАлександрБлок.pdf',
  },
  {
    slug: 'alice-adventures',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    description:
      'Сказочное путешествие девочки Алисы в мир абсурда, логических парадоксов и необычных существ.',
    language: 'English',
    genre: 'Фэнтези',
    tags: ['Фэнтези', 'Сказка'],
    image: '/Alice-adventure.jpg',
    file: "Alice's Adventures in Wonderland _ Project Gutenberg.pdf",
  },
  {
    slug: 'dracula',
    title: 'Dracula',
    author: 'Bram Stoker',
    description: 'Готический роман о графе Дракуле и борьбе с тьмой.',
    language: 'English',
    genre: 'Ужасы',
    tags: ['Ужасы', 'Классика'],
    image: '/Dracula.jpg',
    file: 'Dracula _ Project Gutenberg.pdf',
  },
  {
    slug: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    description:
      'История учёного, создавшего жизнь и столкнувшегося с последствиями.',
    language: 'English',
    genre: 'Фантастика',
    tags: ['Фантастика', 'Драма'],
    image: '/Frankestetion.jpg',
    file: 'Frankenstein _ Project Gutenberg.pdf',
  },
  {
    slug: 'moby-dick',
    title: 'Moby Dick',
    author: 'Herman Melville',
    description: 'История одержимости капитана Ахава белым китом.',
    language: 'English',
    genre: 'Приключения',
    tags: ['Приключения', 'Классика'],
    image: '/MobyDick.jpg',
    file: 'Moby Dick; or The Whale _ Project Gutenberg.pdf',
  },
  {
    slug: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'Роман о любви, предрассудках и социальном статусе.',
    language: 'English',
    genre: 'Роман',
    tags: ['Роман', 'Классика'],
    image: '/Pride and Prejudice-L.jpg',
    file: 'Pride and prejudice _ Project Gutenberg.pdf',
  },
];
