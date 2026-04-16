export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and .txt files are supported." },
        { status: 400 },
      );
    }

    if (file.type === "text/plain") {
      const text = await file.text();
      return NextResponse.json({ text: text.trim() });
    }

    // PDF — extract with unpdf (serverless-safe)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const pdf = await getDocumentProxy(buffer);
    const { text: rawText } = await extractText(pdf, { mergePages: true });

    if (!rawText.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. It may be scanned/image-based. Please paste your CV text manually.",
        },
        { status: 422 },
      );
    }

    const cleaned = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

    return NextResponse.json({ text: cleaned });
  } catch (err) {
    console.error("[/api/parse-cv]", err);
    return NextResponse.json(
      {
        error:
          "Failed to parse the file. Please try pasting your CV text manually.",
      },
      { status: 500 },
    );
  }
}
