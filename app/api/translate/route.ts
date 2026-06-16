// app/api/translate/route.ts
// الوسيط الآمن بين موقع hsk-ar.com و Anthropic
// المفتاح يبقى على السيرفر، ما يوصل المتصفّح أبداً

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const LANG_NAMES: Record<string, string> = {
  ar: "Arabic",
  zh: "Chinese (Simplified)",
  en: "English",
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { mode, text, image, mediaType, source, target } = body || {};
  const srcName = LANG_NAMES[source] || "Arabic";
  const tgtName = LANG_NAMES[target] || "Chinese (Simplified)";

  // حماية بسيطة: حدّ لطول النص
  if (mode !== "image" && (!text || typeof text !== "string")) {
    return NextResponse.json({ error: "No text" }, { status: 400 });
  }
  if (typeof text === "string" && text.length > 2000) {
    return NextResponse.json({ error: "Text too long" }, { status: 400 });
  }

  // بناء محتوى الرسالة حسب الوضع (نص أو صورة)
  let userContent: any;

  if (mode === "image") {
    if (!image || !mediaType) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }
    const sysPrompt =
      `You read text from an image and translate it into ${tgtName}, ` +
      `built by a Chinese teacher who grew up in Saudi Arabia. ` +
      `First extract ALL visible text from the image (any language). ` +
      `Then translate it naturally into ${tgtName}. ` +
      `Respond ONLY with a JSON object, no markdown, no backticks, exactly: ` +
      `{"detected": "...", "translation": "...", "pinyin": "..."}. ` +
      `"detected" = the original text you read. ` +
      `"pinyin" = tone-marked pinyin if target is Chinese, else "". ` +
      `If no readable text, set all fields to "".`;
    userContent = [
      {
        type: "image",
        source: { type: "base64", media_type: mediaType, data: image },
      },
      { type: "text", text: sysPrompt },
    ];
  } else {
    const sysPrompt =
      `You are a precise ${srcName}\u2192${tgtName} translator built by a Chinese teacher ` +
      `who grew up in Saudi Arabia. Translate naturally and idiomatically, not word-for-word. ` +
      `Respond ONLY with a JSON object, no markdown, no backticks, exactly: ` +
      `{"translation": "...", "pinyin": "..."}. ` +
      `"pinyin": tone-marked pinyin if target is Chinese, else "".`;
    userContent = `${sysPrompt}\n\nText to translate:\n${text}`;
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic error:", res.status, errText);
      return NextResponse.json(
        { error: "Translation failed" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const raw = (data.content || [])
      .map((b: any) => (b.type === "text" ? b.text : ""))
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { translation: raw, pinyin: "", detected: "" };
    }

    return NextResponse.json({
      translation: parsed.translation || "",
      pinyin: parsed.pinyin || "",
      detected: parsed.detected || "",
    });
  } catch (e) {
    console.error("Route error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
