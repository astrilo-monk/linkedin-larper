import { NextResponse } from "next/server";
import { resultStore } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.length < 5) {
    return NextResponse.json({ error: "Invalid result ID." }, { status: 400 });
  }

  const stored = await resultStore.get(id);

  if (!stored) {
    return NextResponse.json(
      { error: "Result not found. It may have expired." },
      { status: 404 }
    );
  }

  return NextResponse.json(stored);
}
