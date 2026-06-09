"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
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
import type { Classifier } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** اختر 3 إجابات خاطئة من نفس HSK لو متاحة، وإلا من المجموع */
function pickDistractors(target: Classifier, all: Classifier[]): Classifier[] {
  const others = all.filter((c) => c.id !== target.id);
  const sameHsk = others.filter((c) => c.hsk === target.hsk);
  // ابدأ بـsameHsk، أكمل من الباقي لو ما كفّى
  const pool = sameHsk.length >= 3 ? sameHsk : [...sameHsk, ...others.filter((c) => c.hsk !== target.hsk)];
  return shuffle(pool).slice(0, 3);
}

export function ListeningPractice({
  items,
  allItems,
  onClose,
}: {
  /** البطاقات للجلسة الحالية */
  items: Classifier[];
  /** كل المصنّفات (لاختيار distractors) */
  allItems: Classifier[];
  onClose: () => void;
}) {
  const [deck] = useState<Classifier[]>(() => shuffle(items));
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState(1);
  const [done, setDone] = useState(false);
  // مراحل البطاقة: choosing → revealed
  const [stage, setStage] = useState<"choosing" | "revealed">("choosing");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const { speak } = useSpeech();
  const { toast } = useToast();
  const { recordPractice } = useAchievements();
  const { tickPractice } = useDaily();
  const { rate, state: srsState } = useSrs(allItems.map((i) => i.id));

  const card = deck[idx];
  const total = deck.length;
  const progress = total > 0 ? Math.round((seen / total) * 100) : 0;

  // 4 خيارات: الإجابة + 3 distractors، بترتيب عشوائي
  const choices = useMemo(() => {
    if (!card) return [];
    const distractors = pickDistractors(card, allItems);
    return shuffle([card, ...distractors]);
  }, [card?.id, allItems]);

  const correctIdx = choices.findIndex((c) => c.id === card?.id);

  // نطق تلقائي عند بداية كل بطاقة جديدة
  useEffect(() => {
    if (card && stage === "choosing") {
      const t = setTimeout(() => speak(card.char), 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, stage]);

  function handleChoice(i: number) {
    if (stage !== "choosing") return;
    setSelectedIdx(i);
    setStage("revealed");
  }

  function commonProgress(mastery: number) {
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

  function handleRate(rating: Rating) {
    if (!card) return;
    const cur: SrsCard = srsState.cards[card.id] ?? newCard(card.id);
    const updated = applyRating(cur, rating);
    rate(card.id, rating);

    const mastery =
      rating === "again" ? 25 : rating === "hard" ? 55 : rating === "good" ? 80 : 95;
    commonProgress(mastery);

    const days = updated.interval;
    const dayText = days === 0 ? "اليوم" : days === 1 ? "غداً" : `بعد ${days} يوم`;
    const messages: Record<Rating, { text: string; variant: "error" | "info" | "success" | "violet" }> = {
      again: { text: `ستعود ${dayText}`, variant: "error" },
      hard:  { text: `راجعتها — ${dayText}`, variant: "info" },
      good:  { text: `أحسنت! المراجعة القادمة ${dayText}`, variant: "success" },
      easy:  { text: `إتقان متميّز — ${dayText} ⭐`, variant: "violet" },
    };
    const { text, variant } = messages[rating];
    toast(text, variant);

    advance();
  }

  function advance() {
    setStage("choosing");
    setSelectedIdx(null);
    if (idx + 1 >= total) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setSeen((s) => Math.min(s + 1, total));
    }
  }

  function restart() {
    setIdx(0);
    setSeen(1);
    setStage("choosing");
    setSelectedIdx(null);
    setDone(false);
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h2 className="mb-2 text-2xl font-extrabold text-ink">أحسنت!</h2>
        <p className="mb-6 max-w-sm text-[13px] leading-relaxed text-muted">
          أنجزت {total} {total === 1 ? "بطاقة" : "بطاقات"} في وضع الاستماع
        </p>
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <button
            onClick={restart}
            className="rounded-lg bg-mint py-3 text-[13px] font-bold text-white shadow-card"
          >
            مراجعة مرة أخرى
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#F7F7F7] py-3 text-[13px] font-bold text-muted"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  const isChoosing = stage === "choosing";
  const isCorrect = selectedIdx === correctIdx;

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      {/* الرأس */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]"
          aria-label="إغلاق"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-[13px] font-bold text-ink">
          <span className="rounded bg-mint-soft px-2 py-0.5 text-[10px] font-bold text-mint-deep">
            استماع
          </span>
          <span>
            {idx + 1} / {total}
          </span>
        </div>
        <button
          onClick={restart}
          className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]"
          aria-label="إعادة"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* شريط التقدم */}
      <div className="h-1.5 bg-[#F0F0F0]">
        <div
          className="h-full bg-mint transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* المحتوى */}
      <div className="flex flex-1 flex-col px-5 py-6">
        {/* زر الاستماع */}
        <div className="mb-6 flex flex-col items-center">
          <button
            onClick={() => speak(card.char)}
            className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-mint to-mint-deep shadow-card transition-transform active:scale-95"
            aria-label="استمع للنطق"
          >
            <Volume2 className="h-12 w-12 text-white" />
            <div className="absolute inset-0 rounded-full bg-mint opacity-30 transition-opacity group-hover:animate-ping" />
          </button>
          <p className="mt-4 text-[13px] font-semibold text-muted">
            {isChoosing ? "اضغط للاستماع مرة أخرى" : "الكلمة هي:"}
          </p>
          {/* بعد الكشف: أظهر الحرف + البينيين */}
          {!isChoosing && (
            <div className="mt-3 text-center">
              <div
                className="font-cn text-5xl font-bold text-ink"
                dir="ltr"
              >
                {card.char}
              </div>
              <div className="mt-1 text-[15px] italic text-muted" dir="ltr">
                {card.pinyin}
              </div>
            </div>
          )}
        </div>

        {/* خيارات المعنى أو نتيجة */}
        {isChoosing ? (
          <div className="grid grid-cols-2 gap-2.5">
            {choices.map((c, i) => (
              <button
                key={c.id}
                onClick={() => handleChoice(i)}
                className="rounded-lg border border-line bg-white p-4 text-center text-[13px] font-bold text-ink shadow-card transition-all hover:border-mint hover:shadow-cardHover"
              >
                {c.ar}
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* النتيجة */}
            <div className="mb-4 grid grid-cols-2 gap-2.5">
              {choices.map((c, i) => {
                const isThisCorrect = i === correctIdx;
                const isThisSelected = i === selectedIdx;
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "rounded-lg border p-4 text-center text-[13px] font-bold transition-all",
                      isThisCorrect
                        ? "border-mint bg-mint-soft text-mint-deep"
                        : isThisSelected
                        ? "border-coral bg-coral-soft text-coral"
                        : "border-line bg-white text-muted opacity-50"
                    )}
                  >
                    {c.ar}
                  </div>
                );
              })}
            </div>

            {/* رسالة النتيجة */}
            <div
              className={cn(
                "mb-4 rounded-lg p-3 text-center text-[13px] font-bold",
                isCorrect
                  ? "bg-mint-soft text-mint-deep"
                  : "bg-coral-soft text-coral"
              )}
            >
              {isCorrect ? "✓ إجابة صحيحة!" : "✕ الإجابة الصحيحة بالأخضر"}
            </div>

            {/* أزرار التقييم SRS */}
            <div className="grid grid-cols-4 gap-1.5">
              <button
                onClick={() => handleRate("again")}
                className="flex flex-col items-center gap-1 rounded-lg bg-coral-soft py-3 font-bold text-coral hover:bg-coral hover:text-white"
              >
                <XCircle className="h-5 w-5" />
                <span className="text-[12px]">نسيتها</span>
                <span className="text-[10px] opacity-75">اليوم</span>
              </button>
              <button
                onClick={() => handleRate("hard")}
                className="flex flex-col items-center gap-1 rounded-lg bg-amber-50 py-3 font-bold text-amber-700 hover:bg-amber-500 hover:text-white"
              >
                <AlertCircle className="h-5 w-5" />
                <span className="text-[12px]">صعبة</span>
                <span className="text-[10px] opacity-75">قريباً</span>
              </button>
              <button
                onClick={() => handleRate("good")}
                className="flex flex-col items-center gap-1 rounded-lg bg-mint-soft py-3 font-bold text-mint-deep hover:bg-mint hover:text-white"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-[12px]">جيدة</span>
                <span className="text-[10px] opacity-75">عادي</span>
              </button>
              <button
                onClick={() => handleRate("easy")}
                className="flex flex-col items-center gap-1 rounded-lg bg-violet-soft py-3 font-bold text-violet hover:bg-violet hover:text-white"
              >
                <Sparkles className="h-5 w-5" />
                <span className="text-[12px]">سهلة</span>
                <span className="text-[10px] opacity-75">متميّز</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
