"use client";

import { useState } from "react";
import type { Rating } from "@/lib/spacedRepetition";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

const RATING_CONFIG: Record<
  Rating,
  { label: string; color: string; bgClass: string; textClass: string; icon: string }
> = {
  easy:  { label: "سهلة",   color: "#7C5CFC", bgClass: "bg-violet",    textClass: "text-violet",    icon: "⭐" },
  good:  { label: "جيدة",   color: "#11A88E", bgClass: "bg-mint",      textClass: "text-mint-deep", icon: "✓"  },
  hard:  { label: "صعبة",   color: "#E8A03A", bgClass: "bg-amber-500", textClass: "text-amber-700", icon: "⚠"  },
  again: { label: "نسيتها", color: "#FF4D4F", bgClass: "bg-coral",     textClass: "text-coral",     icon: "✕"  },
};

const RATING_ORDER: Rating[] = ["easy", "good", "hard", "again"];

/**
 * يُرجع رسالة تحفيزية ديناميكية حسب نسبة النجاح
 */
function getMotivationalMessage(
  successRate: number,
  total: number
): { title: string; sub: string; emoji: string; tone: "success" | "info" | "warning" } {
  if (total < 5) {
    return {
      title: "ابدأ بناء سجلك",
      sub: "راجع المزيد من البطاقات لترى نمط أدائك",
      emoji: "✨",
      tone: "info",
    };
  }
  if (successRate >= 85)
    return {
      title: "أداء استثنائي!",
      sub: `${successRate}% من إجاباتك صحيحة`,
      emoji: "🏆",
      tone: "success",
    };
  if (successRate >= 70)
    return {
      title: "أداء ممتاز",
      sub: `${successRate}% من إجاباتك صحيحة — استمر هكذا`,
      emoji: "💪",
      tone: "success",
    };
  if (successRate >= 55)
    return {
      title: "تتحسّن بثبات",
      sub: `${successRate}% من إجاباتك صحيحة — أنت في الطريق`,
      emoji: "📈",
      tone: "info",
    };
  if (successRate >= 40)
    return {
      title: "ركّز على الصعبة",
      sub: `${successRate}% من إجاباتك صحيحة — جرّب مراجعة الكلمات الصعبة`,
      emoji: "📚",
      tone: "warning",
    };
  return {
    title: "خذ وقتك",
    sub: "كل مراجعة تبني ذاكرتك تدريجياً",
    emoji: "🌱",
    tone: "info",
  };
}

export function RatingsDonut({
  ratingTotals,
}: {
  ratingTotals: Record<Rating, number>;
}) {
  const [hovered, setHovered] = useState<Rating | null>(null);

  const total =
    (ratingTotals.again ?? 0) +
    (ratingTotals.hard ?? 0) +
    (ratingTotals.good ?? 0) +
    (ratingTotals.easy ?? 0);

  if (total === 0) {
    return (
      <EmptyState
        icon="📊"
        title="توزيع تقييماتك سيظهر هنا"
        description="ابدأ بمراجعة بطاقات لترى نمط أدائك"
        tone="info"
        size="sm"
      />
    );
  }

  const positive = (ratingTotals.good ?? 0) + (ratingTotals.easy ?? 0);
  const successRate = Math.round((positive / total) * 100);
  const motivation = getMotivationalMessage(successRate, total);

  // === حساب أجزاء الـDonut ===
  const RADIUS = 42;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let cumulativePct = 0;
  const segments = RATING_ORDER.map((rating, idx) => {
    const count = ratingTotals[rating] ?? 0;
    const pct = count / total;
    const length = pct * CIRCUMFERENCE;
    const offset = -cumulativePct * CIRCUMFERENCE;
    cumulativePct += pct;
    return {
      rating,
      count,
      pct,
      length,
      offset,
      orderIdx: idx, // للـ staggered animation
      config: RATING_CONFIG[rating],
    };
  }).filter((s) => s.count > 0);

  // البيانات المعروضة في المنتصف (تتغير عند الـhover)
  const centerData = hovered
    ? {
        value: ratingTotals[hovered],
        label: `${RATING_CONFIG[hovered].label} • ${Math.round(
          ((ratingTotals[hovered] ?? 0) / total) * 100
        )}%`,
      }
    : {
        value: total,
        label: "إجمالي المراجعات",
      };

  const motivationStyles = {
    success: { bg: "bg-mint-soft", border: "border-mint/20", title: "text-mint-deep", sub: "text-mint-deep/80" },
    info:    { bg: "bg-violet-soft", border: "border-violet/20", title: "text-violet", sub: "text-violet/80" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", title: "text-amber-700", sub: "text-amber-700/80" },
  } as const;
  const ms = motivationStyles[motivation.tone];

  return (
    <div>
      {/* ===== Donut Chart ===== */}
      <div className="mb-5 flex items-center justify-center">
        <div className="relative" style={{ width: 180, height: 180 }}>
          <svg
            width="180"
            height="180"
            viewBox="0 0 100 100"
            className="-rotate-90 transform"
            role="img"
            aria-label={`توزيع التقييمات: ${total} مراجعة إجمالاً`}
          >
            {/* track background */}
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="#F0F0F0"
              strokeWidth="10"
            />
            {/* segments — staggered draw animation */}
            {segments.map((s) => {
              const isHovered = hovered === s.rating;
              const isOtherHovered = hovered !== null && !isHovered;
              return (
                <circle
                  key={s.rating}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={s.config.color}
                  strokeWidth={isHovered ? "12" : "10"}
                  strokeDasharray={`${s.length} ${CIRCUMFERENCE - s.length}`}
                  strokeDashoffset={s.offset}
                  strokeLinecap="butt"
                  onMouseEnter={() => setHovered(s.rating)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    cursor: "pointer",
                    opacity: isOtherHovered ? 0.45 : 1,
                    transition: "opacity 200ms ease-out, stroke-width 200ms ease-out",
                    transformOrigin: "50px 50px",
                    animation: `donutDraw 650ms cubic-bezier(0.65, 0, 0.35, 1) ${s.orderIdx * 110}ms both`,
                  }}
                />
              );
            })}
          </svg>

          {/* المنتصف — يتغيّر بحسب الـhover */}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            aria-live="polite"
          >
            <div className="text-[32px] font-black tabular-nums text-ink leading-none">
              {(centerData.value ?? 0).toLocaleString("en-US")}
            </div>
            <div className="mt-1.5 max-w-[120px] text-center text-[10px] font-bold text-muted leading-tight">
              {centerData.label}
            </div>
          </div>
        </div>
      </div>

      {/* ===== قائمة التقييمات (محسّنة) ===== */}
      <div className="mb-5 space-y-2">
        {RATING_ORDER.map((rating) => {
          const count = ratingTotals[rating] ?? 0;
          const cfg = RATING_CONFIG[rating];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isHoveredItem = hovered === rating;
          return (
            <div
              key={rating}
              onMouseEnter={() => count > 0 && setHovered(rating)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center justify-between rounded-lg px-3.5 py-2.5 transition-all",
                count === 0 && "opacity-35",
                count > 0 && isHoveredItem
                  ? "bg-[#F0F0F0]"
                  : count > 0 && "bg-[#FAFAFA] hover:bg-[#F4F4F4]"
              )}
            >
              <div className="flex items-center gap-3">
                {/* نقطة لونية + ايقونة */}
                <span
                  className="flex h-2 w-2 shrink-0 rounded-full"
                  style={{ background: cfg.color }}
                />
                <span className={cn("text-[14px] font-extrabold", cfg.textClass)}>
                  {cfg.icon}
                </span>
                <span className="text-[13px] font-bold text-ink">{cfg.label}</span>
              </div>
              <div className="flex items-baseline gap-2 tabular-nums">
                {/* النسبة الأولى (الرئيسية) */}
                <span className={cn("text-[15px] font-extrabold", cfg.textClass)}>
                  {pct}%
                </span>
                {/* العدد (ثانوي) */}
                <span className="text-[10.5px] font-semibold text-muted">
                  {count} {count === 1 ? "مرة" : "مرة"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== الرسالة التحفيزية (سطرين أنعم) ===== */}
      <div
        className={cn(
          "rounded-lg border px-4 py-3 transition-colors",
          ms.bg,
          ms.border
        )}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none">{motivation.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className={cn("text-[13.5px] font-extrabold leading-tight", ms.title)}>
              {motivation.title}
            </div>
            <div
              className={cn(
                "mt-1 text-[11.5px] leading-relaxed",
                ms.sub
              )}
            >
              {motivation.sub}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
