"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Volume2,
  RefreshCw,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/lib/useSpeech";
import { useToast } from "@/components/Toast";
import { useAchievements } from "@/lib/achievements";
import { useDaily, DAILY_GOAL } from "@/lib/streak";
import { useSrs, applyRating, newCard, type Rating, type SrsCard } from "@/lib/spacedRepetition";
import { checkAnswer, type CheckResult } from "@/lib/answerCheck";
import type { Classifier } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TypingPractice({
  items,
  allItems,
  onClose,
}: {
  items: Classifier[];
  allItems: Classifier[];
  onClose: () => void;
}) {
  const [deck] = useState<Classifier[]>(() => shuffle(items));
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState(1);
  const [done, setDone] = useState(false);
  // مراحل: typing → revealed
  const [stage, setStage] = useState<"typing" | "revealed">("typing");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSpeech();
  const { toast } = useToast();
  const { recordPractice } = useAchievements();
  const { tickPractice } = useDaily();
  const { rate, state: srsState } = useSrs(allItems.map((i) => i.id));

  const card = deck[idx];
  const total = deck.length;
  const progress = total > 0 ? Math.round((seen / total) * 100) : 0;

  // ركّز على input عند بداية كل بطاقة
  useEffect(() => {
    if (stage === "typing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [stage, idx]);

  function handleCheck() {
    if (!card || stage !== "typing") return;
    const res = checkAnswer(input, card.char, card.pinyin);
    setResult(res);
    setStage("revealed");
    if (res.correct) {
      // قم بنطق الكلمة كتعزيز
      setTimeout(() => speak(card.char), 200);
    }
  }

  function handleSkip() {
    if (!card) return;
    setResult({ correct: false, matchType: "none" });
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
    setStage("typing");
    setInput("");
    setResult(null);
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
    setStage("typing");
    setInput("");
    setResult(null);
    setDone(false);
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h2 className="mb-2 text-2xl font-extrabold text-ink">أحسنت!</h2>
        <p className="mb-6 max-w-sm text-[13px] leading-relaxed text-muted">
          أنجزت {total} {total === 1 ? "بطاقة" : "بطاقات"} في وضع الكتابة
        </p>
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <button
            onClick={restart}
            className="rounded-lg bg-violet py-3 text-[13px] font-bold text-white shadow-card"
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

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white">
      {/* الرأس */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-[13px] font-bold text-ink">
          <span className="rounded bg-violet-soft px-2 py-0.5 text-[10px] font-bold text-violet">
            كتابة
          </span>
          <span>
            {idx + 1} / {total}
          </span>
        </div>
        <button
          onClick={restart}
          className="rounded-lg p-2 text-muted hover:bg-[#F7F7F7]"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* شريط التقدم */}
      <div className="h-1.5 bg-[#F0F0F0]">
        <div
          className="h-full bg-violet transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* المحتوى */}
      <div className="flex flex-1 flex-col px-5 py-8">
        {/* السؤال — المعنى فقط دائماً (الـpinyin يظهر في كرت النتيجة) */}
        <div className="mb-6 rounded-lg border border-line bg-[#FAFAFA] p-5">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted">
            المعنى
          </div>
          <div className="text-2xl font-extrabold text-ink">{card.ar}</div>
        </div>

        {/* مرحلة الكتابة */}
        {stage === "typing" && (
          <>
            <label className="mb-2 block text-[13px] font-bold text-ink">
              اكتب الحرف الصيني
            </label>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCheck();
              }}
              dir="ltr"
              className="mb-4 w-full rounded-lg border-2 border-line bg-white px-4 py-4 text-center font-cn text-3xl font-bold text-ink outline-none transition-colors focus:border-violet"
              placeholder="汉字"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#F7F7F7] py-3.5 text-[13px] font-bold text-muted hover:bg-[#EEEEEE]"
              >
                <SkipForward className="h-4 w-4" />
                تخطّي
              </button>
              <button
                onClick={handleCheck}
                disabled={!input.trim()}
                className={cn(
                  "flex flex-[2] items-center justify-center gap-2 rounded-lg py-3.5 text-[13px] font-bold transition-colors",
                  input.trim()
                    ? "bg-violet text-white shadow-card hover:bg-violet/90"
                    : "cursor-not-allowed bg-[#F7F7F7] text-[#C8C8C8]"
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                تحقّق
              </button>
            </div>
          </>
        )}

        {/* مرحلة النتيجة */}
        {stage === "revealed" && result && (
          <>
            {/* الجواب الصحيح */}
            <div
              className={cn(
                "mb-4 rounded-lg p-5 text-center",
                result.correct
                  ? "bg-mint-soft"
                  : "bg-coral-soft"
              )}
            >
              <div
                className={cn(
                  "mb-2 text-[12px] font-extrabold uppercase tracking-wider",
                  result.correct ? "text-mint-deep" : "text-coral"
                )}
              >
                {result.correct
                  ? result.matchType === "pinyin" || result.matchType === "pinyin-no-tones"
                    ? "✓ صحيح (pinyin)"
                    : "✓ صحيح"
                  : "✕ الإجابة الصحيحة:"}
              </div>
              <div
                className="font-cn text-6xl font-bold text-ink"
                dir="ltr"
              >
                {card.char}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="text-[15px] italic text-muted" dir="ltr">
                  {card.pinyin}
                </span>
                <button
                  onClick={() => speak(card.char)}
                  className={cn(
                    "rounded-lg p-1.5 transition-colors",
                    result.correct
                      ? "text-mint-deep hover:bg-mint hover:text-white"
                      : "text-coral hover:bg-coral hover:text-white"
                  )}
                  aria-label="استمع للنطق"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              {/* لو كتب pinyin بدون نغمات */}
              {result.matchType === "pinyin-no-tones" && (
                <div className="mt-3 text-[11px] text-muted">
                  ملاحظة: حاول إضافة النغمات للدقة (مثل: <span className="font-bold" dir="ltr">{card.pinyin}</span>)
                </div>
              )}
              {/* لو خطأ، أعرض ما كتب */}
              {!result.correct && input.trim() && (
                <div className="mt-3 text-[11px] text-muted">
                  كتبت: <span className="font-bold" dir="ltr">{input.trim()}</span>
                </div>
              )}
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
