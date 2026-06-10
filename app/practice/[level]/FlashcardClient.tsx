"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Volume2, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/lib/useSpeech";
import type { Word, HskLevel } from "@/lib/types";

/* ─── localStorage ─── */
type SessionScore = { hard: number; good: number; easy: number };
const SCORE_KEY = "hsk_flashcard_score_v1";

function saveScore(s: SessionScore) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(SCORE_KEY, JSON.stringify(s)); } catch { /* quota */ }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ════════════════════════════════ */
export function FlashcardClient({ level, words }: { level: HskLevel; words: Word[] }) {
  const router = useRouter();
  const { speak, supported } = useSpeech();

  const [deck]              = useState<Word[]>(() => shuffle(words));
  const [idx, setIdx]       = useState(0);
  const [revealed, setReveal] = useState(false);
  const [score, setScore]   = useState<SessionScore>({ hard: 0, good: 0, easy: 0 });
  const [done, setDone]     = useState(false);

  const total   = deck.length;
  const current = deck[idx];

  const charSize =
    current.w.length <= 1 ? "text-[88px]"
    : current.w.length === 2 ? "text-[68px]"
    : current.w.length <= 4 ? "text-[48px]"
    : "text-[34px]";

  const play  = useCallback((text: string) => { if (supported) speak(text); }, [supported, speak]);

  /* ─── تقييم → انتقال فوري ─── */
  const rate = useCallback((rating: "hard" | "good" | "easy") => {
    const next: SessionScore = { ...score, [rating]: score[rating] + 1 };
    setScore(next);
    saveScore(next);                   // حفظ فوري في localStorage

    if (idx >= total - 1) {
      setDone(true);
    } else {
      setReveal(false);                // إخفاء المعنى للكلمة التالية
      setIdx(i => i + 1);             // انتقال فوري
    }
  }, [idx, score, total]);

  function restart() {
    const fresh = { hard: 0, good: 0, easy: 0 };
    setScore(fresh);
    saveScore(fresh);
    setIdx(0);
    setReveal(false);
    setDone(false);
  }

  /* ════ ملخص الجلسة ════ */
  if (done) {
    const reviewed = score.hard + score.good + score.easy;
    const pct = reviewed > 0 ? Math.round(((score.good + score.easy) / reviewed) * 100) : 0;
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-10 bg-[#FAFAF8]">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="text-[56px] mb-3">{pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📚"}</div>
            <h2 className="text-[22px] font-extrabold text-ink">انتهت الجلسة!</h2>
            <p className="mt-1.5 text-[13px] text-muted">راجعت {reviewed} كلمة من {level.label}</p>
          </div>

          <div className="mb-6 overflow-hidden rounded-2xl bg-white"
            style={{ border: "1px solid #E5E5E5", boxShadow: "0 2px 8px rgba(17,24,39,.06),0 12px 28px rgba(17,24,39,.08)" }}>
            <div className="grid grid-cols-3">
              <SumBox emoji="😅" label="صعب"   value={score.hard} color="#FF4D4F" />
              <SumBox emoji="🤔" label="متوسط" value={score.good} color="#E8A03A" border />
              <SumBox emoji="😊" label="سهل"   value={score.easy} color="#11A88E" />
            </div>
            <div className="border-t px-4 py-2.5 text-center text-[13px] font-bold"
              style={{ borderColor: "#EAEAEA", color: level.color }}>
              {pct}% أداء جيد أو ممتاز
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={restart}
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-extrabold text-white"
              style={{ background: level.color }}>
              <RotateCcw className="h-4 w-4" />جولة جديدة
            </button>
            <button onClick={() => router.back()}
              className="rounded-xl border py-3.5 text-[14px] font-bold text-muted"
              style={{ borderColor: "#EAEAEA" }}>
              العودة للمستويات
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ════ شاشة البطاقة ════ */
  return (
    <main className="flex min-h-screen flex-col bg-[#FAFAF8]">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: level.color }}>
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/15 px-3 py-1.5 text-[12.5px] font-bold text-white">
          <X className="h-3.5 w-3.5" />إنهاء
        </button>
        <span className="text-[13.5px] font-extrabold text-white">
          الكلمة {idx + 1} من {total}
        </span>
        <span className="rounded-lg bg-white/20 px-2.5 py-1.5 text-[12px] font-bold text-white">
          {level.label}
        </span>
      </div>

      {/* شريط التقدم */}
      <div className="h-1 w-full" style={{ background: `${level.color}22` }}>
        <div className="h-full transition-all duration-300"
          style={{ width: `${Math.round((idx / total) * 100)}%`, background: level.color }} />
      </div>

      {/* المحتوى */}
      <div className="flex flex-1 flex-col items-center px-5 py-6 gap-4">
        <div className="w-full max-w-sm flex flex-col gap-4">

          {/* البطاقة */}
          <div className="w-full overflow-hidden rounded-2xl bg-white"
            style={{ border: "1px solid #E0E0E0", boxShadow: "0 2px 6px rgba(17,24,39,.06),0 10px 28px rgba(17,24,39,.10)" }}>

            {/* الوجه: الحرف + بينيين + استماع */}
            <div className="flex flex-col items-center px-6 py-7"
              style={{ background: `linear-gradient(160deg, ${level.color}12 0%, ${level.color}05 100%)`,
                       borderBottom: revealed ? `1px solid ${level.color}1A` : undefined }}>
              <div className={cn("font-cn font-bold leading-none", charSize)}
                style={{ color: level.color, direction: "ltr" }}>
                {current.w}
              </div>
              <div className="mt-4 text-[15px] font-semibold italic"
                style={{ color: `${level.color}88`, direction: "ltr" }}>
                {current.p || "—"}
              </div>
              <button onClick={() => play(current.w)}
                className="mt-4 flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white"
                style={{ background: level.color }}>
                <Volume2 className="h-4 w-4" />استمع للكلمة
              </button>
            </div>

            {/* الظهر: يظهر فقط بعد الكشف */}
            {revealed && (
              <div className="px-4 pt-3 pb-4 flex flex-col gap-1.5">
                {/* المعنى */}
                <div className="rounded-xl px-4 py-3 text-center text-[18px] font-extrabold text-ink"
                  style={{ background: level.soft }}>
                  {current.m}
                </div>

                {/* الجملة — بدون مسافة زائدة */}
                <button onClick={() => play(current.s)}
                  className="w-full rounded-xl px-4 py-3 text-right"
                  style={{ background: "#F5F6F8" }}>
                  <div className="font-cn text-[15px] leading-relaxed text-[#2A2A2A]"
                    style={{ direction: "ltr", textAlign: "left" }}>
                    {current.s}
                  </div>
                  <div className="mt-1.5 text-[13px] font-medium text-ink leading-relaxed">
                    {current.sa}
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-1 text-[10.5px] text-muted">
                    <Volume2 className="h-3 w-3" />اضغط للاستماع
                  </div>
                </button>
              </div>
            )}

            {/* زر الكشف — يظهر فقط قبل الكشف */}
            {!revealed && (
              <div className="px-4 py-4">
                <button onClick={() => setReveal(true)}
                  className="w-full rounded-xl border-2 border-dashed py-5 text-[16px] font-bold transition-all active:scale-95"
                  style={{ borderColor: `${level.color}55`, color: level.color }}>
                  اكشف المعنى
                </button>
              </div>
            )}
          </div>

          {/* ─── أزرار التقييم — تظهر فقط بعد الكشف ─── */}
          {revealed && (
            <div className="flex flex-col gap-3">
              <p className="text-center text-[12px] font-semibold text-muted">
                كيف كانت هذه الكلمة؟
              </p>
              <div className="grid grid-cols-3 gap-3">
                <RatingBtn label="صعب"   emoji="😅" sublabel="مراجعة قريبة"
                  bg="#FFF1F0" color="#FF4D4F" ring="#FF4D4F25"
                  onClick={() => rate("hard")} />
                <RatingBtn label="متوسط" emoji="🤔" sublabel="أسبوع تقريباً"
                  bg="#FDF6E7" color="#E8A03A" ring="#E8A03A25"
                  onClick={() => rate("good")} />
                <RatingBtn label="سهل"   emoji="😊" sublabel="فترة أطول"
                  bg="#E6F7F3" color="#11A88E" ring="#11A88E25"
                  onClick={() => rate("easy")} />
              </div>
            </div>
          )}

          {/* تلميح قبل الكشف */}
          {!revealed && (
            <p className="text-center text-[12px] text-muted">
              فكّر في المعنى قبل الكشف
            </p>
          )}

        </div>
      </div>
    </main>
  );
}

/* ─── مكونات ─── */
function RatingBtn({ label, emoji, sublabel, bg, color, ring, onClick }: {
  label: string; emoji: string; sublabel: string;
  bg: string; color: string; ring: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center rounded-2xl px-2 py-6 text-center
                 transition-all duration-100 active:scale-90 active:brightness-90"
      style={{ background: bg, border: `2px solid ${ring}`, boxShadow: `0 4px 12px ${ring}` }}>
      <span className="text-[34px] leading-none">{emoji}</span>
      <span className="mt-2 text-[17px] font-extrabold" style={{ color }}>{label}</span>
      <span className="mt-1 text-[11.5px]" style={{ color: `${color}88` }}>{sublabel}</span>
    </button>
  );
}

function SumBox({ emoji, label, value, color, border }: {
  emoji: string; label: string; value: number; color: string; border?: boolean;
}) {
  return (
    <div className="flex flex-col items-center py-5"
      style={border ? { borderLeft: "1px solid #EAEAEA", borderRight: "1px solid #EAEAEA" } : undefined}>
      <span className="text-[22px]">{emoji}</span>
      <span className="mt-1.5 text-[24px] font-extrabold tabular-nums" style={{ color }}>{value}</span>
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}
