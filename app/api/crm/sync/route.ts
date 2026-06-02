// SECURITY WARNING: This route is a 501 skeleton and DOES NOT store, log, or persist any incoming synchronization requests.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      status: 501,
      message: "CRM backend persistence is not implemented yet. CRM currently runs offline-first in IndexedDB.",
    },
    { status: 501 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
    }
  } catch {
    // Fallback if parsing fails
  }

  return NextResponse.json(
    {
      ok: false,
      status: 501,
      message: "CRM backend persistence is not implemented yet. CRM currently runs offline-first in IndexedDB.",
    },
    { status: 501 }
  );
}
