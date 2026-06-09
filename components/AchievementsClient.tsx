"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Sparkles, BookOpenCheck, ChevronLeft } from "lucide-react";
import { useAchievements } from "@/lib/achievements";
import { useDaily } from "@/lib/streak";
import {
  useSrs,
  getTopMastered,
  getTopForgotten,
  getOverallMastery,
  getReviewsInDays,
} from "@/lib/spacedRepetition";
import { ALL_CLASSIFIERS } from "@/lib/classifiersPro";
import { useToast } from "@/components/Toast";
import { HeroSummary } from "@/components/HeroSummary";
import { WordsBreakdown } from "@/components/WordsBreakdown";
import { WeeklyActivity } from "@/components/WeeklyActivity";
import { AchievementsSkeleton } from "@/components/AchievementsSkeleton";
import { cn } from "@/lib/utils";

/* ============ نافذة تأكيد المسح ============ */
function ConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-cardHover"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-coral-soft">
          <Trash2 className="h-6 w-6 text-coral" />
        </div>
        <h3 className="mb-2 text-lg font-extrabold text-ink">مسح كل الإنجازات؟</h3>
        <p className="mb-5 text-[13px] leading-relaxed text-muted">
          سيتم حذف جميع بياناتك (الـStreak، الكلمات المُمارَسة، نسب الإتقان، الهدف اليومي)
          نهائياً. لا يمكن التراجع.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-[#F7F7F7] py-3 text-[13px] font-bold text-muted hover:bg-[#EEEEEE]"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-coral py-3 text-[13px] font-bold text-white shadow-coral hover:bg-coral/90"
          >
            مسح نهائياً
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ المكوّن الرئيسي ============ */
export function AchievementsClient() {
  const { ready: aReady, stats, resetAll: resetAch } = useAchievements();
  const { ready: dReady, state: daily, resetAll: resetDaily } = useDaily();

  const classifierList = ALL_CLASSIFIERS;
  const classifierIds = classifierList.map((c) => c.id);
  const { ready: sReady, dueCount, state: srsState, resetAll: resetSrs } = useSrs(classifierIds);

  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!aReady || !dReady || !sReady) {
    return <AchievementsSkeleton />;
  }

  function handleReset() {
    resetAch();
    resetDaily();
    resetSrs();
    setConfirmOpen(false);
    toast("تم مسح جميع الإنجازات", "info");
  }

  // إحصاءات
  const overallMastery = getOverallMastery(srsState.cards);
  const weekReviews = getReviewsInDays(srsState.stats.history ?? {}, 7);
  const topMastered = getTopMastered(srsState.cards, 5);
  const topForgotten = getTopForgotten(srsState.cards, 5);

  // تجميع المصنّفات حسب HSK
  const idsByHsk: Record<number, string[]> = {};
  for (const c of classifierList) {
    if (!idsByHsk[c.hsk]) idsByHsk[c.hsk] = [];
    idsByHsk[c.hsk].push(c.id);
  }

  const hasAnyData =
    stats.totalPracticed > 0 || daily.totalDaysActive > 0 || srsState.stats.totalReviews > 0;

  return (
    <>
      {confirmOpen && (
        <ConfirmDialog onConfirm={handleReset} onCancel={() => setConfirmOpen(false)} />
      )}

      {/* ===== 1. الكرت الرئيسي (Streak + الهدف + 3 أرقام) ===== */}
      <HeroSummary
        daily={daily}
        dueCount={dueCount}
        mastery={overallMastery}
        weekReviews={weekReviews}
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-5">
        {/* ===== 2. كرت "حان وقت المراجعة" — يظهر فقط لو فيه مستحقات ===== */}
        {dueCount > 0 && (
          <Link
            href="/classifiers"
            className="mb-8 flex items-center gap-3 overflow-hidden rounded-lg bg-gradient-to-l from-violet to-violet/85 p-4 text-white shadow-violet transition-shadow hover:shadow-cardHover"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20 ring-1 ring-white/10">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">حان وقت المراجعة</div>
              <div className="mt-1 text-lg font-extrabold leading-tight">
                {dueCount} {dueCount === 1 ? "كلمة جاهزة" : "كلمات جاهزة"}
              </div>
              <div className="mt-0.5 text-[12px] opacity-85">
                ابدأ الآن للحفاظ على ذاكرتك القوية
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 shrink-0 opacity-90" />
          </Link>
        )}

        {/* ===== 3. كلماتك (4 tabs: التوزيع / أداؤك / الأقوى / تحتاج مراجعة) ===== */}
        <WordsBreakdown
          cards={srsState.cards}
          topMastered={topMastered}
          topForgotten={topForgotten}
          classifiers={classifierList}
          classifierIdsByHsk={idsByHsk}
          ratingTotals={
            srsState.stats.ratingTotals ?? { again: 0, hard: 0, good: 0, easy: 0 }
          }
        />

        {/* ===== 4. نشاط الأسبوع (مخطط شريطي) ===== */}
        <WeeklyActivity history={srsState.stats.history ?? {}} />

        {/* ===== الأزرار — مسافة mt-2 بعد الأقسام ===== */}
        <section className="mb-4 mt-2 flex flex-col gap-2.5">
          <Link
            href="/classifiers"
            className="flex items-center justify-center gap-2 rounded-lg bg-ink py-3.5 text-[13px] font-bold text-white shadow-card hover:bg-black"
          >
            <Sparkles className="h-4 w-4" />
            ابدأ التمرين
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={!hasAnyData}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg py-3 text-[13px] font-bold transition-colors",
              !hasAnyData
                ? "cursor-not-allowed bg-[#F7F7F7] text-[#C8C8C8]"
                : "bg-coral-soft text-coral hover:bg-coral hover:text-white"
            )}
          >
            <Trash2 className="h-4 w-4" />
            مسح كل الإنجازات
          </button>
        </section>
      </div>
    </>
  );
}
