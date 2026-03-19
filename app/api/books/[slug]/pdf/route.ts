import { NextRequest, NextResponse } from "next/server";
import { getBookBySlug } from "@/data/books";
import fs from "fs";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const book = getBookBySlug(params.slug);
  if (!book?.pdfPath) {
    return NextResponse.json({ error: "Book or PDF not found" }, { status: 404 });
  }

  const pdfDir = path.join(process.cwd(), "pdfBooks");
  const filePath = path.join(pdfDir, book.pdfPath);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "PDF file not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=book.pdf",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
