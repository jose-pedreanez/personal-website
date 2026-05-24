import { NextRequest, NextResponse } from "next/server";
import { appendToSheet, parseBrowser, parseOS, timestamp } from "@/lib/sheets";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const fileId = process.env.RESUME_FILE_ID!;

  void (async () => {
    try {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown";
      const ua = request.headers.get("user-agent") ?? "";
      const referer = request.headers.get("referer") ?? "direct";
      await appendToSheet([
        timestamp(),
        "resume-download",
        ip,
        parseBrowser(ua),
        parseOS(ua),
        referer,
        ua,
      ]);
    } catch (err) {
      console.error("[resume-log]", err);
    }
  })();

  return NextResponse.json({
    viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
  });
}
