"use client";

import Link from "next/link";
import { ChevronLeft, Play, Sparkles, Check } from "lucide-react";
import type { HskLevel } from "@/lib/types";
import type { SrsCard } from "@/lib/spacedRepetition";
import { getWordsForLevel, wordIdFor } from "@/lib/data";
import { todayISO } from "@/lib/spacedRepetition";
import { getHskColor, getHskTextColor, levelIdToHsk } from "@/lib/hskColors";
import { cn } from "@/lib/utils";

/**
 * كرت المستوى — مُعاد تصميمه على نظام تصميم الكلاسيفايرز.
 *
 * لغة التصميم الموحّدة المطبّقة هنا:
 *  • أيقونة 56×56 بـ inset ring بلون المستوى (اللمسة المميزة)
 *  • badge صيني بـ ring خفيف + نص بلون التباين AA
 *  • فواصل border-t نظيفة بين 3 مناطق
 *  • ظل cardSoft المتدرّج + hover ناعم
 *  • تسلسل طباعي: 17→14→11
 */
export function LevelCard({
  level,
  cards,
}: {
  level: HskLevel;
  cards: Record<string, SrsCard>;
}) {
  const hskNum = levelIdToHsk(level.id);
  const color = getHskColor(hskNum);
  const textColor = getHskTextColor(hskNum);

  const availableWords = getWordsForLevel(level.id);
  const availableTotal = availableWords.length;
  const officialTotal = level.count;

  // حساب التقدم والمستحقات من SRS
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

  const coveragePct =
    officialTotal > 0 ? (availableTotal / officialTotal) * 100 : 0;
  const isLowCoverage = hasData && coveragePct < 20;

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-cardSoft transition-shadow hover:shadow-cardSoftHover">
      <div className="p-5">
        {/* ============ منطقة 1: الهوية ============ */}
        <div className="flex items-center gap-3.5">
          {/* الأيقونة — inset ring بلون المستوى */}
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-[30px]"
            style={{
              background: color.soft,
              boxShadow: `inset 0 0 0 1px ${color.hex}22`,
            }}
          >
            {level.emoji}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-extrabold leading-tight text-ink">
                {level.label}
              </h3>
              {/* badge صيني — soft + ring خفيف + نص AA */}
              <span
                className="rounded-lg px-2 py-0.5 font-cn text-[11px] font-extrabold"
                style={{
                  background: color.soft,
                  color: textColor,
                  boxShadow: `inset 0 0 0 1px ${color.hex}33`,
                }}
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
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <div>
              <span
                className="text-[20px] font-extrabold tabular-nums leading-none"
                style={{ color: textColor }}
              >
                {availableTotal}
              </span>
              <span className="ms-1.5 text-[13px] font-bold text-ink">
                كلمة متاحة
              </span>
            </div>
            <div className="text-[10.5px] text-muted">
              من{" "}
              <span className="tabular-nums" dir="ltr">
                {officialTotal.toLocaleString("en-US")}
              </span>{" "}
              رسمياً
            </div>
          </div>
        ) : (
          <div className="mt-4 border-t border-line pt-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-dashed border-line bg-[#FAFAFA] px-3.5 py-3">
              <span className="mt-0.5 text-[15px] leading-none">🌱</span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-ink">قيد الإعداد</div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  نضيف كلمات هذا المستوى تدريجياً بنفس الجودة. جرّب مستوى آخر متاح.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* رسالة التغطية المنخفضة */}
        {isLowCoverage && (
          <div
            className="mt-3 flex items-start gap-2 rounded-lg px-3 py-2"
            style={{ background: color.soft }}
          >
            <Sparkles
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color: textColor }}
            />
            <p className="text-[11px] leading-relaxed" style={{ color: textColor }}>
              ابدأ بالكلمات المتاحة الآن — سنضيف المزيد تدريجياً
            </p>
          </div>
        )}

        {/* ============ منطقة 3: التقدم + الإجراء ============ */}
        {hasData && (
          <div className="mt-4 border-t border-line pt-4">
            {/* شريط التقدم */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-muted">
                  {notStarted ? "لم تبدأ بعد" : "تقدمك"}
                </span>
                {!notStarted && (
                  <span
                    className="font-extrabold tabular-nums"
                    style={{ color: textColor }}
                  >
                    {progressPct}%
                  </span>
                )}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, background: color.hex }}
                />
              </div>
            </div>

            {/* المستحقات + زر الابدأ */}
            <div className="flex items-center justify-between gap-2">
              {due > 0 ? (
                <div
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold"
                  style={{
                    background: color.soft,
                    color: textColor,
                    boxShadow: `inset 0 0 0 1px ${color.hex}22`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {notStarted
                    ? `${availableTotal} ${availableTotal === 1 ? "كلمة جديدة" : "كلمات جديدة"}`
                    : `${due} مستحقة`}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] font-bold text-mint-deep">
                  <Check className="h-3.5 w-3.5" />
                  كل شيء محدّث
                </div>
              )}

              <Link
                href={`/hsk-levels/${level.id}`}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12.5px] font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: color.hex }}
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
