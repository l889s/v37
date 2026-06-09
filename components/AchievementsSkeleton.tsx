"use client";

import { Skeleton } from "@/components/Skeleton";

/**
 * Skeleton لصفحة الإنجازات — يحاكي البنية الفعلية:
 *  1. كرت Hero الكبير
 *  2. كرت "حان وقت المراجعة" (لو ظاهر)
 *  3. كرت "كلماتك" مع tabs
 *  4. كرت "نشاط الأسبوع"
 */
export function AchievementsSkeleton() {
  return (
    <>
      {/* ===== 1. Hero الكبير ===== */}
      <div className="mx-auto mb-8 max-w-2xl px-4 sm:px-5">
        <Skeleton className="h-[260px] rounded-[28px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-5">
        {/* ===== 2. كرت CTA ===== */}
        <Skeleton className="mb-8 h-[88px]" />

        {/* ===== 3. كلماتك ===== */}
        <div className="mb-8">
          <Skeleton className="mb-4 h-5 w-24" />
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-[#F7F7F7] p-1.5">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
            {/* المحتوى */}
            <div className="space-y-3 p-5">
              <Skeleton className="h-3" />
              <Skeleton className="h-3 w-3/4" />
              <div className="space-y-3 pt-2">
                <Skeleton className="h-2" />
                <Skeleton className="h-2 w-5/6" />
                <Skeleton className="h-2 w-4/6" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== 4. نشاط الأسبوع ===== */}
        <div className="mb-8">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="rounded-lg border border-line bg-white p-5">
            <div className="mb-5 flex items-baseline justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
            {/* أعمدة المخطط */}
            <div className="flex items-end justify-between gap-2" style={{ height: 110 }}>
              {[60, 80, 45, 90, 70, 55, 75].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <Skeleton className="h-2 w-4" />
                  <Skeleton className="w-full" style={{ height: `${h}%` }} />
                  <Skeleton className="h-2 w-6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
