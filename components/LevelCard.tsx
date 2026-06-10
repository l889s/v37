"use client";

import Link from "next/link";
import { Play, Sparkles, BookOpen } from "lucide-react";
import type { HskLevel } from "@/lib/types";
import type { SrsCard } from "@/lib/spacedRepetition";
import { getWordsForLevel, wordIdFor } from "@/lib/data";
import { todayISO } from "@/lib/spacedRepetition";
import { cn } from "@/lib/utils";
import { useReadWords } from "@/lib/useReadWords";

/**
 * كرت المستوى — v2
 *
 * التحسينات:
 *  1. Gradient header بلون المستوى (أيقونة + اسم + badge)
 *  2. شريط تقدم مع نسبة مئوية دائماً ظاهرة
 *  3. "ابدأ التعلم الآن" بدل "لم تبدأ بعد"
 *  4. تصميم أنظف بدون شريط عمودي
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

  // ====== التقدم البسيط: كلمات مقروءة من localStorage ======
  const { readCount, progressPct } = useReadWords(level.id, availableTotal);

  // للـSRS: عدد المستحقات فقط (للـbadge)
  const today = todayISO();
  let due = 0;
  for (const w of availableWords) {
    const id = wordIdFor(level.id, w);
    const card = cards[id];
    if (!card || card.nextReview <= today) due++;
  }

  const hasData = availableTotal > 0;
  const notStarted = readCount === 0;

  const coveragePct =
    officialTotal > 0 ? (availableTotal / officialTotal) * 100 : 0;
  const isLowCoverage = hasData && coveragePct < 20;

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-white shadow-cardSoft transition-shadow hover:shadow-cardSoftHover">

      {/* ====== Gradient Header ====== */}
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{
          background: `linear-gradient(135deg, ${level.color}18 0%, ${level.color}08 100%)`,
          borderBottom: `1px solid ${level.color}22`,
        }}
      >
        {/* الأيقونة + الاسم */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[26px]"
            style={{
              background: level.soft,
              boxShadow: `inset 0 0 0 1.5px ${level.color}30`,
            }}
          >
            {level.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-extrabold text-ink">
                {level.label}
              </h3>
              <span
                className="rounded-lg px-2 py-0.5 font-cn text-[10.5px] font-extrabold"
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
            <p className="mt-0.5 text-[11.5px] text-muted">{level.desc}</p>
          </div>
        </div>

        {/* عدد الكلمات */}
        {hasData && (
          <div className="text-left">
            <div
              className="text-[19px] font-extrabold tabular-nums leading-none"
              style={{ color: level.color }}
            >
              {availableTotal.toLocaleString("en-US")}
            </div>
            <div className="mt-0.5 text-[10px] text-muted">كلمة</div>
          </div>
        )}
      </div>

      {/* ====== Body ====== */}
      <div className="p-4">

        {/* حالة: لا توجد كلمات */}
        {!hasData && (
          <div className="rounded-lg border border-dashed border-line bg-[#FAFAFA] px-3.5 py-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 text-[15px]">🌿</span>
              <div>
                <div className="text-[13px] font-bold text-ink">قيد الإعداد</div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  نضيف كلمات هذا المستوى تدريجياً.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* حالة: فيه كلمات */}
        {hasData && (
          <>
            {/* رسالة التغطية المنخفضة */}
            {isLowCoverage && (
              <div
                className="mb-3 flex items-start gap-2 rounded-lg px-3 py-2"
                style={{ background: level.soft }}
              >
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: level.color }} />
                <p className="text-[11px] leading-relaxed" style={{ color: level.color }}>
                  ابدأ بالكلمات المتاحة الآن — سنضيف المزيد تدريجياً
                </p>
              </div>
            )}

            {/* ====== شريط التقدم ====== */}
            <div className="mb-3.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11.5px] font-semibold text-muted">
                  {notStarted ? "ابدأ التعلم الآن" : "تقدمك"}
                </span>
                <span
                  className="text-[12px] font-extrabold tabular-nums"
                  style={{ color: notStarted ? "#B0B0B0" : level.color }}
                >
                  {progressPct}% مكتمل
                </span>
              </div>
              {/* خلفية الشريط */}
              <div className="relative h-2.5 overflow-hidden rounded-full bg-[#EFEFEF]">
                {/* الجزء المكتمل */}
                {progressPct > 0 && (
                  <div
                    className="absolute inset-y-0 right-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: `linear-gradient(90deg, ${level.color}BB, ${level.color})`,
                    }}
                  />
                )}
              </div>
              {/* تفاصيل صغيرة تحت الشريط */}
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted">
                <span>
                  {readCount > 0
                    ? `${readCount} من ${availableTotal} كلمة`
                    : `${availableTotal} كلمة جديدة`}
                </span>
                <span dir="ltr">
                  من {officialTotal.toLocaleString("en-US")} رسمياً
                </span>
              </div>
            </div>

            {/* ====== الإجراء: مستحقات + زرّان ====== */}

            {/* badge المستحقات */}
            <div className="mb-2.5 flex items-center justify-between">
              {due > 0 ? (
                <div
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-extrabold"
                  style={{
                    background: level.soft,
                    color: level.color,
                    boxShadow: `inset 0 0 0 1px ${level.color}22`,
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {notStarted
                    ? `${availableTotal} ${availableTotal === 1 ? "كلمة جديدة" : "كلمة للبدء"}`
                    : `${due} مستحقة`}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-mint-deep">
                  <span className="text-base">✓</span>
                  كل شيء محدّث
                </div>
              )}
            </div>

            {/* زرّان: القاموس + التمرين */}
            <div className="grid grid-cols-2 gap-2">
              {/* زر القاموس — outlined */}
              <Link
                href={`/hsk-levels/${level.id}`}
                className="flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-[12.5px] font-bold transition-opacity hover:opacity-80 active:opacity-70"
                style={{
                  borderColor: `${level.color}55`,
                  color: level.color,
                  background: level.soft,
                }}
              >
                <BookOpen className="h-3.5 w-3.5" />
                القاموس
              </Link>

              {/* زر التمرين — filled */}
              <Link
                href={`/practice/${level.id}`}
                className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-[12.5px] font-bold text-white transition-opacity hover:opacity-90 active:opacity-80"
                style={{ background: level.color }}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                تمرين
              </Link>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
