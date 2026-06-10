"use client";

import { useMemo, useState } from "react";
import { Search, X, Volume2, ArrowRight, ArrowDownAZ, Hash, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/lib/useSpeech";
import { useToast } from "@/components/Toast";
import type { Word, HskLevel } from "@/lib/types";
import { useReadWords } from "@/lib/useReadWords";

type SortMode = "original" | "alpha";

/**
 * صفحة كلمات المستوى — v3.17 (النسخة المعتمدة)
 * أكورديون مطابق للكلاسيفايرز: رأس ملوّن + قسم رمادي + بطاقة جملة بيضاء
 */
export function LevelWordsClient({
  level,
  words,
}: {
  level: HskLevel;
  words: Word[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("original");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { speak, supported } = useSpeech();
  const { markRead } = useReadWords(level.id, words.length);
  const { toast } = useToast();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? words.filter(
          (w) =>
            w.w.includes(q) ||
            w.p.toLowerCase().includes(q) ||
            w.m.includes(q) ||
            w.s.includes(q) ||
            w.sa.includes(q)
        )
      : words;
    if (sort === "alpha") {
      return [...filtered].sort((a, b) =>
        a.p.localeCompare(b.p, "en", { sensitivity: "base" })
      );
    }
    return filtered;
  }, [words, query, sort]);

  function play(text: string) {
    if (!supported) {
      toast("متصفّحك لا يدعم النطق التلقائي", "error");
      return;
    }
    speak(text);
  }

  function toggleItem(i: number, wordId: string) {
    setOpenIndex((prev) => {
      const opening = prev !== i;
      if (opening) markRead(wordId); // تسجيل القراءة عند الفتح فقط
      return opening ? i : null;
    });
  }

  return (
    <>
      {/* رأس الصفحة */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: level.color }}
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
          <span className="rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-extrabold text-white tabular-nums">
            {words.length}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-5">
        {/* العنوان */}
        <div className="mb-5">
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-2xl font-extrabold text-ink">{level.label}</h2>
            <span
              className="rounded-lg px-2.5 py-0.5 font-cn text-[12px] font-extrabold"
              style={{
                background: level.soft,
                color: level.color,
                boxShadow: `inset 0 0 0 1px ${level.color}33`,
              }}
              dir="ltr"
            >
              {level.cn}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-muted">{level.desc}</p>
        </div>

        {/* البحث */}
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث: صيني / بينيين / عربي..."
            className="w-full rounded-lg border border-line bg-white py-3 pr-10 pl-10 text-[13.5px] outline-none transition-colors"
            style={query ? { borderColor: level.color } : undefined}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-[#F0F0F0]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* الترتيب + العدّاد */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <SortChip active={sort === "original"} onClick={() => setSort("original")}
              icon={<Hash className="h-3 w-3" />} color={level.color} soft={level.soft}>
              المنهج
            </SortChip>
            <SortChip active={sort === "alpha"} onClick={() => setSort("alpha")}
              icon={<ArrowDownAZ className="h-3 w-3" />} color={level.color} soft={level.soft}>
              أبجدي
            </SortChip>
          </div>
          <div className="text-[11px] font-bold text-muted tabular-nums">
            {visible.length}
            {query && <> من <span dir="ltr">{words.length}</span></>}
          </div>
        </div>

        {/* رأس القسم */}
        <div className="mb-1 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-muted">{level.cn}</span>
            <span
              className="rounded-lg px-3 py-1 text-[12px] font-extrabold text-white"
              style={{ background: level.color }}
            >
              {level.label}
            </span>
          </div>
          <span className="text-[12px] text-muted">{visible.length} كلمة</span>
        </div>

        {/* حالات فارغة */}
        {words.length === 0 && (
          <div className="rounded-lg border border-dashed border-line bg-[#FAFAFA] px-4 py-10 text-center">
            <div className="mb-2 text-2xl">🌱</div>
            <div className="text-[13px] font-bold text-ink">قيد الإعداد</div>
            <p className="mt-1 text-[11.5px] text-muted">ستُضاف الكلمات تدريجياً</p>
          </div>
        )}
        {words.length > 0 && visible.length === 0 && (
          <div className="rounded-lg border border-dashed border-line bg-[#FAFAFA] px-4 py-10 text-center">
            <div className="mb-2 text-2xl">🔍</div>
            <div className="text-[13px] font-bold text-ink">لا توجد نتائج</div>
            <p className="mt-1 text-[11.5px] text-muted">جرّب كلمة بحث مختلفة</p>
          </div>
        )}

        {/* القائمة الأكورديون */}
        {visible.length > 0 && (
          <div
            className="overflow-hidden rounded-xl bg-white"
            style={{
              border: "1px solid #CECECE",
              boxShadow:
                "0 2px 6px rgba(17,24,39,.07),0 8px 20px rgba(17,24,39,.10),0 20px 44px rgba(17,24,39,.09)",
            }}
          >
            {visible.map((w, i) => {
              const isOpen = openIndex === i;
              const charSize =
                w.w.length <= 1
                  ? "text-[28px]"
                  : w.w.length === 2
                  ? "text-[21px]"
                  : "text-[16px]";

              return (
                <div
                  key={`${w.w}-${i}`}
                  style={
                    i < visible.length - 1
                      ? { borderBottom: "1px solid #D0D0D0" }
                      : undefined
                  }
                >
                  {/* صف الكلمة */}
                  <button
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-right transition-colors"
                    style={{
                      background: isOpen ? level.soft : "#fff",
                      borderBottom: isOpen ? `3px solid ${level.color}` : undefined,
                    }}
                    onClick={() => toggleItem(i, `${level.id}:${w.w}`)}
                  >
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
                      style={{ color: isOpen ? level.color : "#B8B8B8" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-[12px] font-semibold italic text-muted"
                        style={{ direction: "ltr", textAlign: "right" }}
                      >
                        {w.p}
                      </div>
                      <div className="text-[15px] font-extrabold leading-tight text-ink">
                        {w.m}
                      </div>
                    </div>

                    {/* زر الكلمة */}
                    <button
                      className="shrink-0 rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition-colors"
                      style={{
                        background: "#FFF1F0",
                        color: "#C05C00",
                        boxShadow: "inset 0 0 0 1px rgba(255,77,79,.2)",
                      }}
                      onClick={(e) => { e.stopPropagation(); play(w.w); }}
                    >
                      <span className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        الكلمة
                      </span>
                    </button>

                    {/* أيقونة الحرف */}
                    <div
                      className={cn(
                        "flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl font-cn font-bold leading-none",
                        charSize
                      )}
                      style={{
                        background: isOpen ? "#fff" : level.soft,
                        boxShadow: `inset 0 0 0 1.5px ${level.color}59`,
                        color: level.color,
                      }}
                    >
                      {w.w}
                    </div>
                  </button>

                  {/* القسم الموسّع */}
                  {isOpen && (
                    <div className="px-4 pb-4 pt-3" style={{ background: "#F5F6F8" }}>
                      {/* بطاقة الجملة — بيضاء بدون border */}
                      <div
                        className="mb-3 rounded-xl px-4 py-3.5"
                        style={{ background: "#ffffff" }}
                      >
                        <div
                          className="font-cn text-[17px] leading-relaxed text-ink"
                          style={{ direction: "ltr", textAlign: "left" }}
                        >
                          {w.s}
                        </div>
                        {/* الترجمة: 14px / weight-500 / #1A1A1A */}
                        <div
                          className="mt-1.5 leading-relaxed"
                          style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}
                        >
                          {w.sa}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12.5px] font-bold transition-colors"
                          style={{
                            background: "#FFF1F0",
                            color: "#C05C00",
                            boxShadow: "inset 0 0 0 1px rgba(255,77,79,.2)",
                          }}
                          onClick={() => play(w.s)}
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          استمع للجملة
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function SortChip({
  active, onClick, icon, children, color, soft,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode;
  children: React.ReactNode; color: string; soft: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-bold transition-colors",
        active ? "" : "text-muted hover:bg-[#F0F0F0]"
      )}
      style={active ? { background: soft, color, boxShadow: `inset 0 0 0 1px ${color}33` } : undefined}
    >
      {icon}
      {children}
    </button>
  );
}
