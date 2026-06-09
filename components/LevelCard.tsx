"use client";

import Link from "next/link";
import { ChevronLeft, Play, Sparkles } from "lucide-react";
import type { HskLevel } from "@/lib/types";
import type { SrsCard } from "@/lib/spacedRepetition";
import { getWordsForLevel, wordIdFor } from "@/lib/data";
import { todayISO } from "@/lib/spacedRepetition";
import { cn } from "@/lib/utils";

/**
 * كرت المستوى — هيكل 3 مناطق:
 *  1. الهوية: emoji + label + cn + desc
 *  2. الأعداد: المتاح بوضوح + السياق الرسمي
 *  3. الإجراء: التقدم + المستحقات + زر الابدأ
 */
export function LevelCard({
  level,
  cards,
}: {
  level: HskLevel;
  cards: Record<string, SrsCard>;
}) {
  const availableWords = getWordsForLevel(level.id);
  const availableTotal = availableWords.length;
  const officialTotal = level.count;

  // حساب التقدم
  const today = todayISO();
  let practiced = 0;
  let due = 0;
  for (const w of availableWords) {
    const id = wordIdFor(level.id, w);
    const card = cards[id];
    if (card?.lastReviewed) practiced++;
    if (!card || card.nextReview <= today) due++;
  }

  const hasData = availableTotal > 0;
  const progressPct =
    hasData && practiced > 0 ? Math.round((practiced / availableTotal) * 100) : 0;
  const notStarted = practiced === 0;

  // التغطية: قليلة جداً (<20%) للرسالة الودّية
  const coveragePct =
    officialTotal > 0 ? (availableTotal / officialTotal) * 100 : 0;
  const isLowCoverage = hasData && coveragePct < 20;

  return (
    <article className="relative overflow-hidden rounded-lg border border-line bg-white shadow-card transition-shadow hover:shadow-cardHover">
      {/* الشريط اللوني العمودي */}
      <div
        className="absolute right-0 top-0 h-full w-1.5"
        style={{ background: level.color }}
      />

      <div className="p-5 pr-6">
        {/* ============ منطقة 1: الهوية ============ */}
        <div className="flex items-start gap-3.5">
          <div
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg text-[28px]"
            style={{ background: level.soft }}
          >
            {level.emoji}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-extrabold leading-tight text-ink">
                {level.label}
              </h3>
              <span
                className="rounded px-1.5 py-0.5 font-cn text-[10px] font-bold"
                style={{ background: level.soft, color: level.color }}
                dir="ltr"
              >
                {level.cn}
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              {level.desc}
            </p>
          </div>
        </div>

        {/* ============ منطقة 2: الأعداد ============ */}
        {hasData ? (
          <div className="mt-5 border-t border-line pt-4">
            {/* المعلومة الرئيسية: المتاح — extrabold ink */}
            <div className="text-[14px] font-extrabold text-ink leading-tight">
              <span className="tabular-nums">{availableTotal}</span>
              {" "}
              كلمة متاحة
            </div>
            {/* السياق الثانوي: الرسمي — أصغر وأخف بكثير */}
            <div className="mt-1 text-[10.5px] text-muted/80 leading-tight">
              من{" "}
              <span className="tabular-nums" dir="ltr">
                {officialTotal.toLocaleString("en-US")}
              </span>
              {" "}في المنهج الرسمي
            </div>

            {/* رسالة ودّية لو التغطية منخفضة */}
            {isLowCoverage && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                <p className="text-[11px] leading-relaxed text-amber-700">
                  ابدأ بالكلمات المتاحة الآن — سنضيف المزيد تدريجياً
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 border-t border-line pt-4">
            <div className="rounded-lg bg-[#FAFAFA] px-3.5 py-3">
              <div className="flex items-start gap-2.5">
                <span className="text-[15px] leading-none mt-0.5">🌿</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-ink">قيد الإعداد</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    نضيف كلمات هذا المستوى تدريجياً. جرّب مستوى آخر متاح حالياً.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ منطقة 3: الإجراء (التقدم + الزر) ============ */}
        {hasData && (
          <div className="mt-5 border-t border-line pt-4">
            {/* شريط التقدم */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-muted">
                  {notStarted ? "لم تبدأ بعد" : "تقدمك"}
                </span>
                {!notStarted && (
                  <span
                    className="font-extrabold tabular-nums"
                    style={{ color: level.color }}
                  >
                    {progressPct}%
                  </span>
                )}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progressPct}%`,
                    background: level.color,
                  }}
                />
              </div>
            </div>

            {/* المستحقات + الزر */}
            <div className="flex items-center justify-between gap-2">
              {due > 0 ? (
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold",
                    notStarted
                      ? "bg-mint-soft text-mint-deep"
                      : "bg-coral-soft text-coral"
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {notStarted
                    ? `${availableTotal} ${availableTotal === 1 ? "كلمة جديدة" : "كلمات جديدة"}`
                    : `${due} مستحقة`}
                </div>
              ) : (
                <div className="text-[11px] font-semibold text-mint-deep">
                  ✓ كل شيء محدّث
                </div>
              )}

              <Link
                href={`/hsk-levels/${level.id}`}
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: level.color }}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                ابدأ
                <ChevronLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
