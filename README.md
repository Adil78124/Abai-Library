# Abai Library

Фронтенд электронной библиотеки Abai Library — реализация макета из Figma на **Next.js** и **Tailwind CSS**. Без бэкенда, только UI.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Структура

- **`/app`** — страницы (App Router): главная, каталог, ИИ помощник, о проекте, профиль
- **`/components`** — переиспользуемые компоненты: Header, SearchBar, BookCard, CategoryCard, AssistantChat, UserProfile, Footer

## Дизайн

Цвета и стили взяты из Figma (Bronze / Abai Library):

- Фон: `#F6F7F7`
- Акцент: `#926D41` (bronze)
- Тёмный: `#1F2942` (navy)
- Текст: `#0F172A`, `#6B7280`

Вёрстка полностью на компонентах и Tailwind (flex/grid), без вставки SVG-макетов как изображений.
