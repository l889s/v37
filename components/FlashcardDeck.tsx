"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, RotateCw, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Classifier } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FlashcardDeck({ items }: { items: Classifier[] }) {
  const [deck, setDeck] = useState<Classifier[]>(() => shuffle(items));
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [seen, setSeen] = useState(0);

  const card = deck[idx];
  const progress = useMemo(
    () => Math.round(((seen + 1) / deck.length) * 100),
    [seen, deck.length]
  );

  function next() {
    setReveal(false);
    setSeen((s) => Math.min(s + 1, deck.length - 1));
    setIdx((i) => (i + 1) % deck.length);
  }

  function prev() {
    setReveal(false);
    setIdx((i) => (i - 1 + deck.length) % deck.length);
  }

  function restart() {
    setDeck(shuffle(items));
    setIdx(0);
    setSeen(0);
    setReveal(false);
  }

  if (!card) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5">
      {/* شريط التقدم */}
      <div className="mb-4 flex items-center justify-between text-xs font-semibold text-muted">
        <span>
          البطاقة {idx + 1} من {deck.length}
        </span>
        <span>{progress}٪</span>
      </div>
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-[#F0F0F0]">
        <div
          className="h-full bg-coral transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* البطاقة */}
      <div className="relative mb-6 rounded-3xl border border-[#F0F0F0] bg-white p-8 shadow-card min-h-[280px] flex flex-col items-center justify-center text-center">
        <div className="font-cn text-7xl font-bold text-coral mb-3" dir="ltr">
          {card.char}
        </div>
        <div className="text-[15px] italic text-muted" dir="ltr">
          {card.pinyin}
        </div>

        {reveal && (
          <div className="mt-6 w-full border-t border-[#F0F0F0] pt-5">
            <div className="mb-2 inline-flex rounded bg-coral-soft px-2 py-0.5 text-[11px] font-bold text-coral">
              HSK {card.hsk}
            </div>
            <h3 className="mb-2 text-xl font-extrabold text-ink">{card.ar}</h3>
            <p className="text-[13px] leading-relaxed text-muted">{card.usage}</p>
            {card.examples[0] && (
              <div className="mt-4 rounded-lg bg-coral-soft/40 px-4 py-2.5 text-[13px]">
                <div dir="ltr" className="font-cn text-[15px] text-ink">
                  {card.examples[0].zh}
                </div>
                <div className="text-xs text-muted">{card.examples[0].ar}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* أزرار */}
      <div className="mb-3 flex gap-2.5">
        <button
          onClick={() => setReveal((r) => !r)}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-3.5 text-[13px] font-bold transition-colors",
            reveal
              ? "bg-[#F7F7F7] text-muted"
              : "bg-coral text-white shadow-coral"
          )}
        >
          {reveal ? (
            <>
              <EyeOff className="h-4 w-4" />
              إخفاء
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              اكشف الإجابة
            </>
          )}
        </button>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={prev}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#F7F7F7] py-3 text-[13px] font-bold text-muted hover:bg-[#EEEEEE]"
        >
          <ArrowRight className="h-4 w-4" />
          السابق
        </button>
        <button
          onClick={restart}
          className="flex items-center justify-center rounded-lg bg-[#F7F7F7] px-4 py-3 text-muted hover:bg-[#EEEEEE]"
          aria-label="إعادة"
        >
          <RotateCw className="h-4 w-4" />
        </button>
        <button
          onClick={next}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink py-3 text-[13px] font-bold text-white hover:bg-black"
        >
          التالي
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
