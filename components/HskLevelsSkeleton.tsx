"use client";

import { Skeleton } from "@/components/Skeleton";

/**
 * Skeleton لصفحة المستويات — يحاكي البنية:
 *  1. Tabs (HSK 2.0 / HSK 3.0)
 *  2. سطر الوصف
 *  3. 5 كروت مستويات
 */
export function HskLevelsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5">
      {/* ===== Tabs ===== */}
      <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-lg border border-line bg-[#F7F7F7] p-1.5">
        <Skeleton className="h-[52px]" />
        <Skeleton className="h-[52px]" />
      </div>

      {/* وصف النظام */}
      <Skeleton className="mb-5 h-3 w-2/3" />

      {/* قائمة المستويات */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <LevelCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** كرت مستوى واحد بالـskeleton — يحاكي LevelCard */
function LevelCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-line bg-white">
      {/* شريط لوني خفيف */}
      <Skeleton className="absolute right-0 top-0 h-full w-1.5 rounded-none" />

      <div className="p-5 pr-6">
        {/* الهوية */}
        <div className="flex items-start gap-3.5">
          <Skeleton className="h-[52px] w-[52px] shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>

        {/* الأعداد */}
        <div className="mt-5 border-t border-line pt-4 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-2.5 w-40" />
        </div>

        {/* الإجراء */}
        <div className="mt-5 border-t border-line pt-4">
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
