"use client";

import Link from "next/link";
import { useDaily } from "@/lib/streak";

export function DailyStreakChip() {
  const { ready, state } = useDaily();
  if (!ready) return <div className="h-[76px]" aria-hidden />;

  const { streak, today, goal } = state;
  const pct = Math.min(100, Math.round((today.count / goal) * 100));
  const isOnStreak = streak.current > 0;

  return (
    <Link href="/achievements" className="mx-auto mb-[18px] block max-w-2xl px-4 sm:px-5">
      <div
        className="flex items-center justify-between gap-3 overflow-hidden rounded-2xl px-[18px] py-[17px]"
        style={{
          backgroundImage: isOnStreak
            ? "linear-gradient(135deg, #FF6B35 0%, #FF4D4F 100%)"
            : "linear-gradient(135deg, #FFF3D6 0%, #FFEAE0 55%, #FFE3E1 100%)",
          border: isOnStreak ? "none" : "1.5px solid #F3C97A",
          boxShadow: isOnStreak
            ? "0 8px 24px rgba(255,77,79,0.28)"
            : "0 2px 6px rgba(243,201,122,0.20), 0 8px 22px rgba(255,140,90,0.14)",
        }}
      >
        {/* السهم */}
        <span
          className="text-[22px]"
          style={{ color: isOnStreak ? "rgba(255,255,255,.8)" : "#C99A4E" }}
          aria-hidden
        >
          ‹
        </span>

        {/* النص */}
        <div className="flex-1 text-right">
          <div className="flex flex-row-reverse items-baseline justify-start gap-2">
            {isOnStreak ? (
              <>
                <span className="text-2xl font-black tabular-nums text-white">
                  {streak.current}
                </span>
                <span className="text-xs font-bold text-white/90">يوم متتالي</span>
              </>
            ) : (
              <span className="text-base font-extrabold" style={{ color: "#B45309" }}>
                ابدأ سلسلتك اليوم! 🎯
              </span>
            )}
          </div>
          <div
            className="mt-1 text-[12.5px] font-semibold"
            style={{ color: isOnStreak ? "rgba(255,255,255,.9)" : "#C2761A" }}
          >
            {isOnStreak
              ? today.goalMet
                ? "✅ تحقّق الهدف اليوم"
                : `${today.count} / ${goal} كلمات اليوم`
              : "راجع ١٠ كلمات وابدأ سلسلتك 🔥"}
          </div>
        </div>

        {/* الأيقونة / حلقة التقدّم */}
        {isOnStreak ? (
          <div className="relative h-[42px] w-[42px]">
            <svg width="42" height="42" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="17" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="3" />
              <circle
                cx="21" cy="21" r="17" fill="none"
                stroke="#fff" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 17}
                strokeDashoffset={2 * Math.PI * 17 * (1 - pct / 100)}
                transform="rotate(-90 21 21)"
                style={{ transition: "stroke-dashoffset .5s" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold tabular-nums text-white">
              {pct}%
            </div>
          </div>
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-[14px]"
            style={{
              background: "rgba(255,255,255,0.6)",
              boxShadow: "inset 0 0 0 1px rgba(243,201,122,0.5)",
            }}
          >
            <span
              className="inline-block text-[28px]"
              style={{
                animation: "flamewiggle 1.8s ease-in-out infinite",
                filter: "drop-shadow(0 2px 4px rgba(232,120,40,.4))",
              }}
            >
              🔥
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
