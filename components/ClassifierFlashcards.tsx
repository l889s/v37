"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  RotateCw,
  Volume2,
  RefreshCw,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/lib/useSpeech";
import { useToast } from "@/components/Toast";
import { useAchievements } from "@/lib/achievements";
import { useDaily, DAILY_GOAL } from "@/lib/streak";
import { useSrs, applyRating, newCard, type Rating, type SrsCard } from "@/lib/spacedRepetition";
import { ReviewContext } from "@/components/ReviewContext";
import { EmptyState } from "@/components/EmptyState";
import type { Classifier } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ClassifierFlashcards({
  items,
  onClose,
  mode = "normal",
}: {
  items: Classifier[];
  onClose: () => void;
  mode?: "normal" | "srs";
}) {
  const [deck, setDeck] = useState<Classifier[]>(() => shuffle(items));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(1);
  const [done, setDone] = useState(false);
  const [flashRating, setFlashRating] = useState<Rating | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [ratingCounts, setRatingCounts] = useState<Record<Rating, number>>({
    again: 0, hard: 0, good: 0, easy: 0,
  });
  const [startedAt] = useState(() => Date.now());

  const { speak } = useSpeech();
  const { toast } = useToast();
  const { recordPractice } = useAchievements();
  const { tickPractice } = useDaily();
  const { rate, state: srsState } = useSrs(items.map((i) => i.id));

  const card = deck[idx];
  const total = deck.length;
  const progress = useMemo(
    () => (total > 0 ? Math.round((seen / total) * 100) : 0),
    [seen, total]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (!flipped && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setFlipped(true);
      } else if (flipped && mode === "srs") {
        if (e.key === "1") handleRate("again");
        if (e.key === "2") handleRate("hard");
        if (e.key === "3") handleRate("good");
        if (e.key === "4") handleRate("easy");
      } else if (flipped && mode === "normal") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleNext();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, idx, total, mode]);

  function recordCommonProgress(mastery: number) {
    if (!card) return;
    recordPractice(
      {
        levelId: `classifiers_hsk${card.hsk}`,
        w: card.char,
        p: card.pinyin,
        m: card.ar,
      },
      mastery
    );
    const { goalJustMet } = tickPractice();
    if (goalJustMet) {
      toast(`🎉 تحقّق هدف اليوم! (${DAILY_GOAL} كلمة)`, "success");
    }
  }

  function handleNext() {
    if (!card) return;
    recordCommonProgress(flipped ? 70 : 40);
    advance();
  }

  function handleRate(rating: Rating) {
    if (!card) return;
    const cur = srsState.cards[card.id] ?? newCard(card.id);
    const updated = applyRating(cur, rating);
    rate(card.id, rating);

    const mastery =
      rating === "again" ? 25 :
      rating === "hard"  ? 55 :
      rating === "good"  ? 80 : 95;
    recordCommonProgress(mastery);

    const days = updated.interval;
    const dayText = days === 0 ? "اليوم" : days === 1 ? "غداً" : `بعد ${days} يوم`;
    const isNew = cur.lastReviewed === null;
    const wasStable = cur.reps >= 3;

    let text = "";
    let variant: "error" | "info" | "success" | "violet" = "info";

    if (rating === "again") {
      variant = "error";
      text = wasStable
        ? `تنسى أحياناً — هذا طبيعي. ستعود ${dayText}`
        : isNew
        ? `بداية صعبة — ستعود ${dayText}`
        : `لا بأس! ستعود ${dayText} للتركيز`;
    } else if (rating === "hard") {
      variant = "info";
      text = isNew ? `تحتاج تكرار — ستعود ${dayText}` : `صعبة عليك — ستعود ${dayText}`;
    } else if (rating === "good") {
      variant = "success";
      text = cur.reps >= 2
        ? `✨ ثابتة! المراجعة القادمة ${dayText}`
        : `أحسنت! المراجعة القادمة ${dayText}`;
    } else {
      variant = "violet";
      text = cur.reps >= 3
        ? `إتقان رائع — لن تراها إلا ${dayText} ⭐`
        : `سهلة عليك! المراجعة ${dayText} ⭐`;
    }

    toast(text, variant);
    setRatingCounts((rc) => ({ ...rc, [rating]: rc[rating] + 1 }));
    setFlashRating(rating);
    window.setTimeout(() => {
      setFlashRating(null);
      advance();
    }, 350);
  }

  function advance() {
    setFlipped(false);
    if (idx + 1 >= total) {
      setDone(true);
      return;
    }
    setTransitioning(true);
    window.setTimeout(() => {
      setIdx((i) => i + 1);
      setSeen((s) => Math.min(s + 1, total));
      setTransitioning(false);
    }, 180);
  }

  function restart() {
    setDeck(shuffle(items));
    setIdx(0);
    setSeen(1);
    setFlipped(false);
    setDone(false);
    setRatingCounts({ again: 0, hard: 0, good: 0, easy: 0 });
  }

  if (done) {
    const totalRated = ratingCounts.again + ratingCounts.hard + ratingCounts.good + ratingCounts.easy;
    const positive = ratingCounts.good + ratingCounts.easy;
    const successRate = totalRated > 0 ? Math.round((positive / totalRated) * 100) : 0;
    const elapsedMs = Date.now() - startedAt;
    const elapsedMin = Math.floor(elapsedMs / 60000);
    const elapsedSec = Math.floor((elapsedMs % 60000) / 1000);
    const durationText = elapsedMin > 0 ? `${elapsedMin} د ${elapsedSec} ث` : `${elapsedSec} ثانية`;

    const ratingRows: { rating: Rating; icon: string; label: string; color: string; bg: string }[] = [
      { rating: "easy",  icon: "⭐", label: "سهلة",   color: "text-violet",    bg: "bg-violet-soft" },
      { rating: "good",  icon: "✓",  label: "جيدة",   color: "text-mint-deep", bg: "bg-mint-soft" },
      { rating: "hard",  icon: "⚠",  label: "صعبة",   color: "text-amber-700", bg: "bg-amber-50" },
      { rating: "again", icon: "✕",  label: "نسيتها", color: "text-coral",     bg: "bg-coral-soft" },
    ];

    return (
      <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm">
          <div className="mb-2 text-center text-6xl">🎉</div>
          <h2 className="mb-1 text-center text-2xl font-extrabold text-ink">أحسنت!</h2>
          <p className="mb-5 text-center text-[13px] leading-relaxed text-muted">
            راجعت {total} {total === 1 ? "بطاقة" : "بطاقات"} في {durationText}
          </p>
          {totalRated > 0 && (
            <div className="mb-4 overflow-hidden rounded-lg border border-line bg-white">
              {ratingRows.map((r) => {
                const count = ratingCounts[r.rating];
                if (count === 0) return null;
                const pct = totalRated > 0 ? (count / totalRated) * 100 : 0;
                return (
                  <div
                    key={r.rating}
                    className="relative flex items-center justify-between border-b border-line px-4 py-2.5 last:border-b-0"
                  >
                    <div
                      className={cn("absolute inset-y-0 right-0 transition-all duration-500", r.bg)}
                      style={{ width: `${pct}%`, opacity: 0.5 }}
                    />
                    <div className="relative flex items-center gap-2.5">
                      <span className={cn("text-[15px] font-extrabold", r.color)}>{r.icon}</span>
                      <span className="text-[13px] font-bold text-ink">{r.label}</span>
                    </div>
                    <div className={cn("relative text-[15px] font-extrabold tabular-nums", r.color)}>
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {totalRated > 0 && (
            <div className="mb-5 flex items-center justify-center gap-2 text-[13px]">
              <span className="font-semibold text-muted">نسبة النجاح:</span>
              <span className={cn(
                "text-lg font-extrabold tabular-nums",
                successRate >= 80 ? "text-mint-deep" : successRate >= 60 ? "text-amber-700" : "text-coral"
              )}>
                {successRate}%
              </span>
              <span>{successRate >= 80 ? "🎯" : successRate >= 60 ? "💪" : "📚"}</span>
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            <button onClick={restart} className="rounded-lg bg-coral py-3 text-[13px] font-bold text-white shadow-coral">
              مراجعة مرة أخرى
            </button>
            <button onClick={onClose} className="rounded-lg bg-[#F7F7F7] py-3 text-[13px] font-bold text-muted">
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="fixed inset-0 z-[80] flex flex-col bg-white">
        <div className="flex items-center justify-end border-b border-line px-4 py-3">
          <button onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]" aria-label="إغلاق">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            icon="📭"
            title={mode === "srs" ? "لا توجد كلمات مستحقة الآن" : "لا توجد كلمات للممارسة"}
            description={
              mode === "srs"
                ? "أحسنت! راجعت كل ما يجب اليوم. عُد لاحقاً عندما تحين المراجعات القادمة."
                : "جرّب تعديل الفلاتر أو اختيار مستوى آخر للممارسة"
            }
            action={{
              label: mode === "srs" ? "العودة" : "تصفّح المستويات",
              href: mode === "srs" ? undefined : "/hsk-levels",
              onClick: mode === "srs" ? onClose : undefined,
            }}
            tone={mode === "srs" ? "success" : "info"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white" role="dialog" aria-modal="true">
      {/* الرأس */}
      <div className="flex items-center justify-between border-b border-[#F0F0F0] px-4 py-3">
        <button onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]" aria-label="إغلاق">
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-[13px] font-bold text-ink">
          {mode === "srs" && (
            <span className="rounded bg-violet-soft px-2 py-0.5 text-[10px] font-bold text-violet">مراجعة</span>
          )}
          <span>{idx + 1} / {total}</span>
        </div>
        <button onClick={restart} className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]" aria-label="إعادة الخلط">
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* شريط التقدم */}
      <div className="h-1.5 bg-[#F0F0F0]">
        <div className="h-full bg-coral transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* المحتوى */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
        {mode === "srs" && card && (() => {
          const cur: SrsCard = srsState.cards[card.id] ?? newCard(card.id);
          const previewGood = applyRating(cur, "good");
          return <ReviewContext card={cur} goodInterval={previewGood.interval} />;
        })()}

        <div className={cn("relative w-full max-w-md flip-scene transition-all duration-200", transitioning && "translate-y-2 opacity-0")}>
          {flashRating && (
            <div className={cn(
              "pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-3xl",
              "animate-[flashFade_350ms_ease-out_forwards]",
              flashRating === "again" && "bg-coral/85",
              flashRating === "hard"  && "bg-amber-500/85",
              flashRating === "good"  && "bg-mint/85",
              flashRating === "easy"  && "bg-violet/85",
            )}>
              <div className="text-7xl drop-shadow-lg">
                {flashRating === "again" && "✕"}
                {flashRating === "hard"  && "⚠"}
                {flashRating === "good"  && "✓"}
                {flashRating === "easy"  && "⭐"}
              </div>
            </div>
          )}

          <div
            className={cn("flip-card h-[420px]", flipped && "flipped")}
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
          >
            {/* الأمامي */}
            <div className="flip-face flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-[#F0F0F0] bg-white p-6 text-center shadow-card">
              <div className="font-cn text-[120px] font-bold leading-none text-coral" dir="ltr">
                {card.char}
              </div>
              <div className="mt-3 text-lg italic text-muted" dir="ltr">{card.pinyin}</div>
              <button
                onClick={(e) => { e.stopPropagation(); speak(card.char); }}
                className="mt-6 flex items-center gap-2 rounded-lg bg-coral-soft px-4 py-2 text-[13px] font-bold text-coral"
              >
                <Volume2 className="h-4 w-4" />
                استمع للنطق
              </button>
              <div className="mt-6 text-xs font-semibold text-muted">اضغط البطاقة لقلبها</div>
            </div>

            {/* الخلفي */}
            <div className="flip-back flip-face flex cursor-pointer flex-col rounded-3xl border border-[#F0F0F0] bg-white p-6 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded bg-coral-soft px-2.5 py-0.5 text-[11px] font-bold text-coral">
                  HSK {card.hsk}
                </span>
                <span className="font-cn text-2xl text-muted" dir="ltr">{card.char}</span>
              </div>
              <h3 className="mb-3 text-2xl font-extrabold text-ink">{card.ar}</h3>
              <p className="mb-4 text-[13px] leading-relaxed text-muted">{card.usage}</p>
              {card.examples.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-muted">أمثلة:</div>
                  {card.examples.slice(0, 2).map((ex, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); speak(ex.zh); }}
                      className="flex w-full items-center gap-2 rounded-lg bg-coral-soft/40 px-3 py-2 text-right hover:bg-coral-soft/70"
                    >
                      <Volume2 className="h-4 w-4 shrink-0 text-coral" />
                      <div className="flex-1">
                        <div dir="ltr" className="font-cn text-[15px] text-ink">{ex.zh}</div>
                        <div className="text-xs text-muted">{ex.ar}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* الأزرار */}
      <div className="border-t border-[#F0F0F0] p-4">
        {!flipped && (
          <button
            onClick={() => setFlipped(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-coral py-3.5 text-[13px] font-bold text-white shadow-coral"
          >
            <RotateCw className="h-4 w-4" />
            اكشف الإجابة
          </button>
        )}

        {flipped && mode === "normal" && (
          <button
            onClick={handleNext}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-3.5 text-[13px] font-bold text-white hover:bg-black"
          >
            التالي
          </button>
        )}

        {flipped && mode === "srs" && (
          <div>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => handleRate("again")}
                className="flex flex-col items-center gap-1 rounded-lg bg-coral-soft py-3 font-bold text-coral hover:bg-coral hover:text-white"
                title="نسيتها (1)"
              >
                <XCircle className="h-5 w-5" />
                <span className="text-[12px]">نسيتها</span>
                <span className="text-[10px] opacity-75">اليوم</span>
              </button>
              <button
                onClick={() => handleRate("hard")}
                className="flex flex-col items-center gap-1 rounded-lg bg-amber-50 py-3 font-bold text-amber-600 hover:bg-amber-500 hover:text-white"
                title="صعبة (2)"
              >
                <AlertCircle className="h-5 w-5" />
                <span className="text-[12px]">صعبة</span>
                <span className="text-[10px] opacity-75">قريباً</span>
              </button>
              <button
                onClick={() => handleRate("good")}
                className="flex flex-col items-center gap-1 rounded-lg bg-mint-soft py-3 font-bold text-mint hover:bg-mint hover:text-white"
                title="جيدة (3)"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-[12px]">جيدة</span>
                <span className="text-[10px] opacity-75">عادي</span>
              </button>
              <button
                onClick={() => handleRate("easy")}
                className="flex flex-col items-center gap-1 rounded-lg bg-violet-soft py-3 font-bold text-violet hover:bg-violet hover:text-white"
                title="سهلة (4)"
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-[12px]">سهلة</span>
                <span className="text-[10px] opacity-75">متميّز</span>
              </button>
            </div>
            <div className="mt-2 text-center text-[10px] text-muted">
              اختصارات: 1 (نسيتها) · 2 (صعبة) · 3 (جيدة) · 4 (سهلة)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
