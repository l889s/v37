import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { ClassifiersClient } from "@/components/ClassifiersClient";
import { Skeleton } from "@/components/Skeleton";
import { CLASSIFIER_LEVELS, ALL_CLASSIFIERS } from "@/lib/classifiersPro";

export const metadata: Metadata = {
  title: "كلمات الكمية",
  description:
    "المصنّفات الصينية (量词) — كلمات الكمية الأساسية مع الاستخدام التفصيلي والأمثلة والملاحظات المهمة.",
};

/** Skeleton بسيط لصفحة المصنّفات */
function ClassifiersSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-5">
      <Skeleton className="mb-3 h-12" />
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px]" />
        ))}
      </div>
    </div>
  );
}

export default function ClassifiersPage() {
  const withData = ALL_CLASSIFIERS.length;
  return (
    <main className="min-h-screen">
      <Hero
        title="كلمات الكمية"
        subtitle={`${withData} مصنِّف بشرح تفصيلي · الاستخدام والأمثلة والملاحظات المهمة`}
        emoji="量"
        kicker="量词用法 · 量词"
      />
      <Suspense fallback={<ClassifiersSkeleton />}>
        <ClassifiersClient levels={CLASSIFIER_LEVELS} />
      </Suspense>
    </main>
  );
}
