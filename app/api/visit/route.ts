import { NextRequest, NextResponse } from "next/server";
import { appendToSheet, parseBrowser, parseOS, timestamp } from "@/lib/sheets";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  void (async () => {
    try {
      const { page } = await request.json();
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown";
      const ua = request.headers.get("user-agent") ?? "";
      const referer = request.headers.get("referer") ?? "direct";
      await appendToSheet([
        timestamp(),
        "page-visit",
        ip,
        parseBrowser(ua),
        parseOS(ua),
        page ?? referer,
        ua,
      ]);
    } catch (err) {
      console.error("[visit-log]", err);
    }
  })();

  return NextResponse.json({ ok: true });
}
