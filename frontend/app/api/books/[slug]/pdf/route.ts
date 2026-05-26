import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "PDF files are served by the backend storage API." },
    { status: 404 },
  );
}
