"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { resolveReadPdfUrl } from "@/lib/book-mapper";
import { loadBookBySlug } from "@/lib/books-loader";
import type { UiBook } from "@/lib/book-mapper";

export default function BookReadPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [book, setBook] = useState<UiBook | null>(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<unknown>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setBookLoading(true);
      const result = await loadBookBySlug(slug);
      if (!cancelled) {
        setBook(result?.book ?? null);
        setBookLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pdfUrl = book ? resolveReadPdfUrl(book, slug) : null;

  useEffect(() => {
    if (!pdfUrl || typeof window === "undefined") return;

    let cancelled = false;
    const currentPdfUrl = pdfUrl;

    async function loadPdf() {
      setLoading(true);
      setError(null);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const res = await fetch(currentPdfUrl);
        if (!res.ok) throw new Error("PDF не найден");
        const blob = await res.blob();
        const data = await blob.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({ data }).promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setNumPages(pdf.numPages);
        setPageNumber(1);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Ошибка загрузки PDF");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  const renderPage = useCallback(async (pageNum: number) => {
    const pdf = pdfDocRef.current as {
      getPage: (n: number) => Promise<{
        getViewport: (o: { scale: number }) => { width: number; height: number };
        render: (o: {
          canvasContext: CanvasRenderingContext2D;
          viewport: unknown;
        }) => { promise: Promise<void> };
      }>;
    } | null;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport }).promise;
  }, []);

  useEffect(() => {
    if (numPages !== null && pageNumber >= 1 && pageNumber <= numPages) {
      renderPage(pageNumber);
    }
  }, [pageNumber, numPages, renderPage]);

  if (bookLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-gray-500">
        Загрузка…
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-600">Книга не найдена.</p>
        <Link href="/catalog" className="mt-4 inline-block text-gold hover:underline">
          ← В каталог
        </Link>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-600">Для этой книги пока нет электронной версии.</p>
        <Link href={`/book/${slug}`} className="mt-4 inline-block text-gold hover:underline">
          ← Назад к книге
        </Link>
      </div>
    );
  }

  const goPrev = () => setPageNumber((p) => Math.max(1, p - 1));
  const goNext = () => setPageNumber((p) => Math.min(numPages ?? 1, p + 1));

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <Link
          href={`/book/${slug}`}
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          ← {book.title}
        </Link>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-medium text-black hover:bg-gray-200"
        >
          Открыть PDF в новой вкладке
        </a>
      </div>

      {loading && (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Загрузка PDF…
        </div>
      )}

      {error && pdfUrl && (
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-sm text-amber-700">
            Встроенный просмотр недоступен. Откройте PDF в новой вкладке или смотрите ниже:
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gold hover:underline"
          >
            Открыть PDF в новой вкладке
          </a>
          <iframe
            src={pdfUrl}
            title={book.title}
            className="min-h-[600px] w-full flex-1 rounded-xl border border-gray-200"
          />
        </div>
      )}

      {!loading && !error && numPages !== null && (
        <>
          <div className="flex flex-1 justify-center overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
            <canvas ref={canvasRef} className="shadow-sm" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={pageNumber <= 1}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              ← Назад
            </button>
            <span className="text-sm text-gray-600">
              {pageNumber} / {numPages}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={pageNumber >= numPages}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Вперёд →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
