"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Search, X, Volume2, ArrowRight, ArrowDownAZ, Hash, ChevronDown, Lock, PencilLine, Repeat2, Square, Bookmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/lib/useSpeech";
import { useToast } from "@/components/Toast";
import type { Word, HskLevel } from "@/lib/types";
import { useReadWords } from "@/lib/useReadWords";
import { createClient } from "@/lib/supabase/client";
import { HanziWriterModal } from "@/components/HanziWriterModal";

const FREE_LIMIT = 50;

type SortMode = "original" | "alpha";

// ===== علامة الوصول (Bookmark) — تخزين محلي =====
// يحفظ: آخر كلمة فتحها الطالب (تلقائي) + علامة يدوية يثبّتها بنفسه
function useBookmark(levelId: string) {
  const autoKey = `hsk:lastpos:${levelId}`;   // آخر موقع تلقائي
  const manualKey = `hsk:bookmark:${levelId}`; // العلامة اليدوية

  const [lastPos, setLastPos] = useState<string | null>(null);
  const [bookmark, setBookmark] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLastPos(localStorage.getItem(autoKey));
      setBookmark(localStorage.getItem(manualKey));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  // تحديث آخر موقع تلقائياً (يُستدعى عند فتح كلمة)
  function saveLastPos(wordKey: string) {
    setLastPos(wordKey);
    try { localStorage.setItem(autoKey, wordKey); } catch {}
  }

  // تثبيت/إلغاء العلامة اليدوية
  function toggleBookmark(wordKey: string) {
    setBookmark((prev) => {
      const next = prev === wordKey ? null : wordKey;
      try {
        if (next) localStorage.setItem(manualKey, next);
        else localStorage.removeItem(manualKey);
      } catch {}
      return next;
    });
  }

  return { lastPos, bookmark, saveLastPos, toggleBookmark };
}

// كشف iOS قوي: Capacitor أولاً، ثم user-agent كاحتياط (يغطي iPhone و iPad و iPod)
function detectIOS(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as any).Capacitor;
  if (cap && typeof cap.getPlatform === "function" && cap.getPlatform() === "ios") {
    return true;
  }
  const ua = window.navigator.userAgent || "";
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
  // iPadOS الحديث يظهر كـ Mac، فنكشفه عبر اللمس
  const isIPadOS =
    ua.includes("Macintosh") &&
    typeof document !== "undefined" &&
    "ontouchend" in document;
  return isIOSDevice || isIPadOS;
}

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
  const [writerChars, setWriterChars] = useState<string | null>(null);
  const [loopingId, setLoopingId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const { speak, supported } = useSpeech();
  const { markRead } = useReadWords(level.id, words.length);
  const { toast } = useToast();
  const loopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // علامة الوصول
  const { lastPos, bookmark, saveLastPos, toggleBookmark } = useBookmark(level.id);

  // الرقم الثابت حسب المنهج: نربط كل كلمة برقمها الأصلي (1-based)
  // يبقى ثابتاً حتى لو غيّر الطالب الفرز إلى أبجدي
  const numberOf = useMemo(() => {
    const m = new Map<Word, number>();
    words.forEach((w, idx) => m.set(w, idx + 1));
    return m;
  }, [words]);

  // اكتشاف منصّة iOS — على iOS كل المحتوى مجاني بالكامل
  useEffect(() => {
    if (detectIOS()) setIsIOS(true);
  }, []);

  // إيقاف التكرار عند مغادرة الصفحة
  useEffect(() => {
    return () => {
      if (loopTimer.current) clearTimeout(loopTimer.current);
    };
  }, []);

  // فحص حالة الاشتراك
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setCheckingAuth(false); return; }
      const { data } = await supabase
        .from("profiles")
        .select("subscription_status, role")
        .eq("id", user.id)
        .single();
      if (data?.subscription_status === "paid" || data?.role === "admin") {
        setIsPaid(true);
      }
      setCheckingAuth(false);
    });
  }, []);

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

  // تشغيل/إيقاف التكرار المستمر: كلمة ← جملة ← (انتظار) ← يعيد
  function toggleLoop(id: string, word: string, sentence: string) {
    // لو نفس الكلمة شغّالة → أوقف
    if (loopingId === id) {
      stopLoop();
      return;
    }
    if (!supported) {
      toast("متصفّحك لا يدعم النطق التلقائي", "error");
      return;
    }
    stopLoop();
    setLoopingId(id);

    const cycle = () => {
      play(word);
      loopTimer.current = setTimeout(() => {
        play(sentence);
        loopTimer.current = setTimeout(cycle, 4000);
      }, 1500);
    };
    cycle();
  }

  function stopLoop() {
    if (loopTimer.current) {
      clearTimeout(loopTimer.current);
      loopTimer.current = null;
    }
    setLoopingId(null);
  }

  function toggleItem(i: number, wordId: string, wordKey: string) {
    // منع فتح الكلمات المقفلة — لا قفل على iOS
    if (!isIOS && !isPaid && i >= FREE_LIMIT) return;
    stopLoop();
    setOpenIndex((prev) => {
      const opening = prev !== i;
      if (opening) {
        markRead(wordId);
        saveLastPos(wordKey); // حفظ آخر موقع تلقائياً
      }
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

        {/* شريط استئناف المراجعة — يظهر لو فيه آخر موقع محفوظ أو علامة يدوية */}
        {(bookmark || lastPos) && (
          <button
            onClick={() => {
              const target = bookmark || lastPos;
              if (!target) return;
              // لو فيه بحث/فرز يخفي الكلمة، نرجّع للوضع الأصلي أولاً
              if (query) setQuery("");
              if (sort !== "original") setSort("original");
              // ننتقل للكلمة بعد تحديث القائمة
              setTimeout(() => {
                const el = document.getElementById(`word-${target}`);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  // وميض تمييز بسيط عند الوصول
                  el.style.transition = "background-color .4s ease";
                  el.style.backgroundColor = level.soft;
                  setTimeout(() => { el.style.backgroundColor = ""; }, 1200);
                }
              }, 60);
            }}
            className="mb-4 flex w-full items-center justify-between rounded-xl px-4 py-3 text-right transition-colors"
            style={{ background: level.soft, boxShadow: `inset 0 0 0 1px ${level.color}33` }}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark
                className="h-5 w-5 shrink-0"
                style={{ color: level.color }}
                fill={bookmark ? "currentColor" : "none"}
              />
              <div>
                <p className="text-[13px] font-bold" style={{ color: level.color }}>
                  {bookmark ? "علامتك المحفوظة" : "أكمل من حيث وقفت"}
                </p>
                <p className="text-[11px] text-muted">اضغط للانتقال إلى الكلمة</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4" style={{ color: level.color }} />
          </button>
        )}

        {/* شريط المجاني — يظهر فقط للغير مشتركين (مخفي على iOS) */}
        {!isIOS && !isPaid && !checkingAuth && words.length > FREE_LIMIT && (
          <div
            className="mb-4 flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "#FFF8E7", border: "1px solid #FFD97D" }}
          >
            <div>
              <p className="text-[13px] font-bold text-amber-800">
                🆓 أول {FREE_LIMIT} كلمة متاحة
              </p>
              <p className="text-[11.5px] text-amber-700 mt-0.5">
                سجّل للوصول لكل {words.length} كلمة
              </p>
            </div>
            <Link
              href="/sign-up"
              className="rounded-lg px-4 py-2 text-[12.5px] font-bold text-white transition-colors"
              style={{ background: level.color }}
            >
              سجّل الآن
            </Link>
          </div>
        )}

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
              const isLocked = !isIOS && !isPaid && i >= FREE_LIMIT;
              const loopId = `${level.id}:${w.w}:${i}`;
              const isLooping = loopingId === loopId;
              // الرقم الثابت حسب المنهج (لا يتغيّر مع الفرز)
              const wordNum = numberOf.get(w) ?? i + 1;
              const wordKey = `${level.id}:${w.w}:${wordNum}`;
              const isBookmarked = bookmark === wordKey;
              const isLastPos = !isBookmarked && lastPos === wordKey;
              const charSize =
                w.w.length <= 1
                  ? "text-[28px]"
                  : w.w.length === 2
                  ? "text-[21px]"
                  : "text-[16px]";

              return (
                <div
                  key={`${w.w}-${i}`}
                  id={`word-${wordKey}`}
                  className="scroll-mt-20 transition-shadow"
                  style={{
                    ...(i < visible.length - 1
                      ? { borderBottom: "1px solid #D0D0D0" }
                      : {}),
                    ...(isBookmarked
                      ? { boxShadow: `inset 3px 0 0 ${level.color}` }
                      : isLastPos
                      ? { boxShadow: `inset 3px 0 0 ${level.color}66` }
                      : {}),
                  }}
                >
                  {/* صف الكلمة */}
                  <button
                    className="flex w-full items-stretch gap-2.5 px-3 py-3 text-right transition-colors"
                    style={{
                      background: isLocked
                        ? "#F9F9F9"
                        : isBookmarked
                        ? level.soft
                        : isOpen
                        ? level.soft
                        : "#fff",
                      borderBottom: isOpen ? `3px solid ${level.color}` : undefined,
                    }}
                    onClick={() => toggleItem(i, `${level.id}:${w.w}`, wordKey)}
                  >
                    {/* عمود الرقم + زر التوسعة (مدموج، بداية الصف) */}
                    <div className="flex w-9 shrink-0 flex-col items-center justify-center gap-1">
                      <span
                        className={cn(
                          "text-[10px] font-bold leading-none tabular-nums",
                          isLocked ? "text-gray-300" : "text-muted"
                        )}
                        dir="ltr"
                      >
                        {wordNum}
                      </span>
                      {isLocked ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                          <Lock className="h-3.5 w-3.5 text-gray-300" />
                        </span>
                      ) : (
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full transition-transform"
                          style={{
                            background: isOpen ? level.color : level.soft,
                            boxShadow: isOpen ? "none" : `inset 0 0 0 1px ${level.color}40`,
                          }}
                        >
                          <ChevronDown
                            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                            style={{ color: isOpen ? "#fff" : level.color }}
                          />
                        </span>
                      )}
                    </div>

                    {/* النص: بينيين + المعنى (مساحة واسعة) */}
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <div
                        className={cn(
                          "text-[12px] font-semibold italic leading-tight",
                          isLocked ? "text-gray-300 blur-[3px]" : "text-muted"
                        )}
                        style={{ direction: "ltr", textAlign: "right" }}
                      >
                        {w.p}
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-[15px] font-extrabold leading-snug",
                          isLocked ? "text-gray-300 blur-[3px]" : "text-ink"
                        )}
                      >
                        {w.m}
                      </div>
                    </div>

                    {/* زر صوت الكلمة — أيقونة مدمجة */}
                    {isLocked ? (
                      <Link
                        href="/sign-up"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full"
                        style={{ background: "#F3F4F6", color: "#9CA3AF" }}
                      >
                        <Lock className="h-4 w-4" />
                      </Link>
                    ) : (
                      <button
                        aria-label="استمع للكلمة"
                        title="استمع للكلمة"
                        className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full transition-transform active:scale-90"
                        style={{
                          background: "#FFF1F0",
                          color: "#C05C00",
                          boxShadow: "inset 0 0 0 1px rgba(255,77,79,.2)",
                        }}
                        onClick={(e) => { e.stopPropagation(); play(w.w); }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    )}

                    {/* أيقونة الحرف */}
                    <div
                      className={cn(
                        "flex h-[52px] w-[52px] shrink-0 items-center justify-center self-center rounded-xl font-cn font-bold leading-none",
                        charSize,
                        isLocked && "blur-[4px]"
                      )}
                      style={{
                        background: isLocked ? "#F3F4F6" : isOpen ? "#fff" : level.soft,
                        boxShadow: isLocked ? "none" : `inset 0 0 0 1.5px ${level.color}59`,
                        color: isLocked ? "#D1D5DB" : level.color,
                      }}
                    >
                      {w.w}
                    </div>
                  </button>

                  {/* القسم الموسّع */}
                  {isOpen && !isLocked && (
                    <div className="px-4 pb-4 pt-3" style={{ background: "#F5F6F8" }}>
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
                        <div
                          className="mt-1.5 leading-relaxed"
                          style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}
                        >
                          {w.sa}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {/* زر علامة الوصول — يثبّت/يلغي نقطة المراجعة */}
                        <button
                          aria-label={isBookmarked ? "إزالة العلامة" : "ضع علامة هنا"}
                          title={isBookmarked ? "إزالة العلامة" : "ضع علامة هنا"}
                          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90"
                          style={
                            isBookmarked
                              ? { background: level.color, color: "#fff" }
                              : { background: level.soft, color: level.color, boxShadow: `inset 0 0 0 1px ${level.color}33` }
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(wordKey);
                          }}
                        >
                          <Bookmark
                            className="h-[18px] w-[18px]"
                            fill={isBookmarked ? "currentColor" : "none"}
                          />
                        </button>

                        {/* زر كتابة الحرف — أيقونة دائرية */}
                        <button
                          aria-label="اكتب الحرف"
                          title="اكتب الحرف"
                          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform active:scale-90"
                          style={{
                            background: level.soft,
                            color: level.color,
                            boxShadow: `inset 0 0 0 1px ${level.color}33`,
                          }}
                          onClick={() => setWriterChars(w.w)}
                        >
                          <PencilLine className="h-[18px] w-[18px]" />
                        </button>

                        {/* زر تكرار — أيقونة دائرية تتحول لإيقاف */}
                        <button
                          aria-label={isLooping ? "إيقاف التكرار" : "تكرار مستمر"}
                          title={isLooping ? "إيقاف التكرار" : "تكرار مستمر"}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90",
                            isLooping && "animate-pulse"
                          )}
                          style={
                            isLooping
                              ? { background: "#4338CA", color: "#fff" }
                              : { background: "#EEF2FF", color: "#4338CA", boxShadow: "inset 0 0 0 1px rgba(67,56,202,.2)" }
                          }
                          onClick={() => toggleLoop(loopId, w.w, w.s)}
                        >
                          {isLooping ? (
                            <Square className="h-[16px] w-[16px]" fill="currentColor" />
                          ) : (
                            <Repeat2 className="h-[18px] w-[18px]" />
                          )}
                        </button>

                        {/* استمع للجملة — يبقى نص */}
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

                  {/* بانر التسجيل — يظهر عند الكلمة 51 فقط (مخفي على iOS) */}
                  {isLocked && i === FREE_LIMIT && (
                    <div
                      className="flex items-center justify-between px-4 py-3"
                      style={{ background: "#FFFBEB", borderTop: "2px solid #FCD34D" }}
                    >
                      <div>
                        <p className="text-[13px] font-bold text-amber-800">
                          🔒 وصلت للحد المتاح
                        </p>
                        <p className="text-[11.5px] text-amber-700">
                          سجّل للوصول لباقي الكلمات
                        </p>
                      </div>
                      <Link
                        href="/sign-up"
                        className="rounded-lg px-4 py-2 text-[12.5px] font-bold text-white"
                        style={{ background: level.color }}
                      >
                        سجّل الآن
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* لوحة كتابة الحرف */}
      {writerChars && (
        <HanziWriterModal
          chars={writerChars}
          color={level.color}
          onClose={() => setWriterChars(null)}
        />
      )}
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
