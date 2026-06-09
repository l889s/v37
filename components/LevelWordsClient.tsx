"use client";

import { useMemo, useState } from "react";
import { Search, X, Volume2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/lib/useSpeech";
import { useToast } from "@/components/Toast";
import type { Word, HskLevel } from "@/lib/types";

export function LevelWordsClient({
  level,
  words,
}: {
  level: HskLevel;
  words: Word[];
}) {
  const [query, setQuery] = useState("");
  const { speak, supported } = useSpeech();
  const { toast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;
    return words.filter(
      (w) =>
        w.w.includes(q) ||
        w.p.toLowerCase().includes(q) ||
        w.m.includes(q) ||
        w.s.includes(q) ||
        w.sa.includes(q)
    );
  }, [words, query]);

  function play(text: string) {
    if (!supported) {
      toast("متصفّحك لا يدعم النطق التلقائي", "error");
      return;
    }
    speak(text);
  }

  return (
    <>
      {/* رأس بلون المستوى */}
      <div
        style={{ background: level.color }}
        className="flex items-center justify-between px-4 py-3"
      >
        <Link
          href="/hsk-levels"
          className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/15 px-3.5 py-1.5 text-[13px] font-bold text-white hover:bg-white/25"
        >
          <ArrowRight className="h-4 w-4" />
          المستويات
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-extrabold text-white">
            {level.emoji} {level.label}
          </span>
          <span className="rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-bold text-white">
            {words.length}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-5">
        {/* عنوان وشرح */}
        <div className="mb-5">
          <h2 className="mb-1.5 text-2xl font-extrabold text-ink">
            {level.label} <span className="font-cn text-[15px] text-muted">— {level.cn}</span>
          </h2>
          <p className="text-[13px] text-muted">{level.desc}</p>
        </div>

        {/* البحث */}
        <div className="relative mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث: صيني / بينيين / عربي..."
            dir="rtl"
            className={cn(
              "w-full rounded-lg border bg-white px-12 py-3.5 text-[15px] outline-none transition-colors",
              query ? "" : "border-[#E8E8E8]"
            )}
            style={query ? { borderColor: level.color } : undefined}
          />
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B0B0B0]" />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]"
              aria-label="مسح"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mb-4 text-xs font-semibold text-muted">
          {filtered.length} كلمة{query && ` من ${words.length}`}
        </div>

        {/* كروت الكلمات */}
        <div className="flex flex-col gap-3.5">
          {words.length === 0 && (
            <div className="rounded-lg bg-[#F7F7F7] p-8 text-center text-[13px] text-muted">
              عيّنة الكلمات لهذا المستوى ستُضاف لاحقاً
            </div>
          )}
          {filtered.length === 0 && words.length > 0 && (
            <div className="rounded-lg bg-[#F7F7F7] p-8 text-center text-[13px] text-muted">
              لا توجد نتائج
            </div>
          )}

          {filtered.map((w, i) => (
            <article
              key={i}
              className="relative overflow-hidden rounded-3xl border border-[#F0F0F0] bg-white p-5 shadow-card"
            >
              {/* شريط لوني علوي */}
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: level.color }}
              />

              <div className="mt-1.5 flex items-start justify-between">
                <button
                  onClick={() => play(w.w)}
                  className="flex-1 cursor-pointer text-right"
                >
                  <div
                    className="font-cn text-5xl font-bold leading-tight"
                    style={{ color: level.color, direction: "ltr", textAlign: "left" }}
                  >
                    {w.w}
                  </div>
                  <div
                    className="mt-1 text-[13px] italic text-muted"
                    style={{ direction: "ltr", textAlign: "left" }}
                  >
                    {w.p}
                  </div>
                </button>
              </div>

              {/* المعنى */}
              <div
                className="my-3 rounded-lg px-3 py-2.5 text-right text-[13px] font-bold text-ink"
                style={{ background: level.soft }}
              >
                📖 {w.m}
              </div>

              {/* الجملة */}
              <button
                onClick={() => play(w.s)}
                className="block w-full text-left"
                style={{ direction: "ltr" }}
              >
                <div className="font-cn text-[17px] leading-relaxed text-[#2A2A2A]">
                  {w.s}
                </div>
              </button>
              <div className="mb-3 mt-1 text-right text-[13px] text-muted">
                {w.sa}
              </div>

              {/* أزرار الصوت */}
              <div className="flex gap-2">
                <button
                  onClick={() => play(w.w)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-bold text-white"
                  style={{ background: level.color }}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  الكلمة
                </button>
                <button
                  onClick={() => play(w.s)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#F7F7F7] py-2.5 text-[13px] font-bold text-muted hover:bg-[#EEEEEE]"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  الجملة
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
