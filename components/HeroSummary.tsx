"use client";

import { Flame, Trophy, BookOpenCheck, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyState } from "@/lib/streak";

export function HeroSummary({
  daily,
  dueCount,
  mastery,
  weekReviews,
}: {
  daily: DailyState;
  dueCount: number;
  mastery: number;
  weekReviews: number;
}) {
  const { streak, today, goal } = daily;
  const pct = Math.min(100, Math.round((today.count / goal) * 100));
  const remaining = Math.max(0, goal - today.count);
  const isOnStreak = streak.current > 0;

  return (
    <div className="mx-auto mb-8 max-w-2xl px-4 sm:px-5">
      <div
        // ← lift خفيف: ظل cardLg + 8px radius
        className="relative overflow-hidden rounded-lg shadow-cardLg"
        style={{
          background: isOnStreak
            ? "linear-gradient(135deg, #FF6B35 0%, #FF4D4F 50%, #E03131 100%)"
            : "linear-gradient(135deg, #8C8C8C 0%, #6C6C6C 100%)",
        }}
      >
        {/* خلفية زخرفية */}
        <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/5" />

        {/* ==== الجزء العلوي: الـStreak ==== */}
        {/* padding p-6 = 24px (بدل 20) */}
        <div className="relative px-6 pt-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Flame
                className={cn(
                  "h-[70px] w-[70px] drop-shadow-lg",
                  isOnStreak ? "fill-amber-300 text-amber-300" : "text-white/60"
                )}
                style={{
                  filter: isOnStreak
                    ? "drop-shadow(0 0 16px rgba(252,211,77,.8))"
                    : "none",
                }}
              />
              <div>
                {/* ← 56px بدل 64 (أكثر تناسقاً مع الـbody) */}
                <div className="text-[56px] font-black leading-none tabular-nums">
                  {streak.current}
                </div>
                <div className="mt-1.5 text-xs font-bold uppercase tracking-wider opacity-90">
                  {streak.current === 1 ? "يوم" : "أيام متتالية"}
                </div>
              </div>
            </div>

            {streak.longest > 0 && (
              // ring بدل border = lift أنعم
              <div className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 ring-1 ring-white/10 backdrop-blur">
                <Trophy className="h-4 w-4" />
                <div className="text-right">
                  <div className="text-[10px] font-semibold opacity-90">الأطول</div>
                  <div className="text-[15px] font-extrabold leading-none tabular-nums">
                    {streak.longest}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* رسالة تحفيزية — 13px ثابت */}
          <div className="mt-3.5 text-[13px] font-semibold leading-relaxed opacity-95">
            {!isOnStreak && "ابدأ سلسلتك اليوم! 🔥"}
            {isOnStreak && today.goalMet && "أحسنت! حافظ على سلسلتك غداً 💪"}
            {isOnStreak &&
              !today.goalMet &&
              `بقي ${remaining} ${remaining === 1 ? "كلمة" : "كلمات"} للحفاظ على سلسلتك`}
          </div>
        </div>

        {/* ==== الهدف اليومي (داخلي) ==== */}
        <div className="relative mx-6 mt-5 rounded-lg bg-white/15 p-4 ring-1 ring-white/10 backdrop-blur">
          <div className="mb-2.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="text-[13px] font-extrabold">الهدف اليومي</span>
            </div>
            <div className="text-[13px] font-extrabold tabular-nums" dir="ltr">
              {today.count} / {goal}
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/25">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                today.goalMet ? "bg-mint" : "bg-amber-300"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* ==== الـ3 أرقام (footer) ==== */}
        {/* gap-[2px] أوضح + bg-white/15 خلفية أبرز */}
        <div className="relative mt-6 grid grid-cols-3 gap-[2px] bg-white/15 px-[2px] pb-[2px]">
          <Stat
            icon={BookOpenCheck}
            value={dueCount}
            label="مستحقة"
            highlight={dueCount > 0}
          />
          <Stat
            icon={Target}
            value={`${mastery}%`}
            label="نسبة الإتقان"
          />
          <Stat
            icon={TrendingUp}
            value={weekReviews}
            label="هذا الأسبوع"
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 px-2 py-3.5 text-white",
        // ← خلفية أوضح للـhighlight
        highlight ? "bg-white/20" : "bg-black/10"
      )}
    >
      <Icon className="h-4 w-4 opacity-90" />
      {/* ← 24px موحّد للأرقام الكبيرة (بدل 20) */}
      <div className="text-2xl font-black leading-none tabular-nums">{value}</div>
      <div className="text-[10px] font-bold opacity-90">{label}</div>
    </div>
  );
}
