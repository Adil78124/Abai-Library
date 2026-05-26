-- Enums for configurable site showcases.
CREATE TYPE "CollectionPlacement" AS ENUM ('HOME', 'CATALOG', 'BOOK_PAGE');
CREATE TYPE "CollectionType" AS ENUM ('MANUAL', 'AUTOMATIC');
CREATE TYPE "AutomaticCollectionKind" AS ENUM ('NEW_BOOKS', 'POPULAR', 'AI_READY', 'RECENTLY_UPDATED');

-- Book metadata extensions. Legacy "author", "image", "file", "genre" and "tags"
-- stay in place so existing public UI and uploaded data continue to work.
ALTER TABLE "Book"
ALTER COLUMN "author" SET DEFAULT '',
ADD COLUMN "authorId" TEXT,
ADD COLUMN "shortDescription" TEXT,
ADD COLUMN "ageLimit" INTEGER,
ADD COLUMN "isbn" TEXT,
ADD COLUMN "publishedYear" INTEGER,
ADD COLUMN "publisher" TEXT,
ADD COLUMN "pageCount" INTEGER,
ADD COLUMN "coverImage" TEXT,
ADD COLUMN "pdfFile" TEXT;

UPDATE "Book" SET "coverImage" = "image" WHERE "coverImage" IS NULL;
UPDATE "Book" SET "pdfFile" = "file" WHERE "pdfFile" IS NULL;

CREATE TABLE "Author" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "birthYear" INTEGER,
  "deathYear" INTEGER,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Category" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tag" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BookCategory" (
  "id" TEXT NOT NULL,
  "bookId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BookTag" (
  "id" TEXT NOT NULL,
  "bookId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "BookTag_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Collection" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "placement" "CollectionPlacement" NOT NULL DEFAULT 'HOME',
  "type" "CollectionType" NOT NULL DEFAULT 'MANUAL',
  "automaticKind" "AutomaticCollectionKind",
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CollectionBook" (
  "id" TEXT NOT NULL,
  "collectionId" TEXT NOT NULL,
  "bookId" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "CollectionBook_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");
CREATE UNIQUE INDEX "BookCategory_bookId_categoryId_key" ON "BookCategory"("bookId", "categoryId");
CREATE UNIQUE INDEX "BookTag_bookId_tagId_key" ON "BookTag"("bookId", "tagId");
CREATE UNIQUE INDEX "CollectionBook_collectionId_bookId_key" ON "CollectionBook"("collectionId", "bookId");

ALTER TABLE "Book" ADD CONSTRAINT "Book_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookTag" ADD CONSTRAINT "BookTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionBook" ADD CONSTRAINT "CollectionBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
