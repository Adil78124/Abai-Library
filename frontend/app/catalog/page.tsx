import { Suspense } from "react";
import CatalogPageContent from "@/components/CatalogPageContent";

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500">
          Загрузка каталога…
        </div>
      }
    >
      <CatalogPageContent />
    </Suspense>
  );
}
