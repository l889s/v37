import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { GrammarClient } from "@/components/GrammarClient";
import { Skeleton } from "@/components/Skeleton";
import { GRAMMAR_LEVELS, ALL_GRAMMAR } from "@/lib/grammarPro";

export const metadata: Metadata = {
  title: "القواعد",
  description:
    "قواعد اللغة الصينية (语法) — التراكيب الأساسية مع الشرح التفصيلي والأمثلة والملاحظات المهمة.",
};

/** Skeleton بسيط لصفحة القواعد */
function GrammarSkeleton() {
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

export default function GrammarPage() {
  const withData = ALL_GRAMMAR.length;
  return (
    <main className="min-h-screen">
      <Hero
        title="القواعد"
        subtitle={`${withData} قاعدة بشرح تفصيلي · التركيب والأمثلة والملاحظات المهمة`}
        emoji="语"
        kicker="语法 · القواعد النحوية"
      />
      <Suspense fallback={<GrammarSkeleton />}>
        <GrammarClient levels={GRAMMAR_LEVELS} />
      </Suspense>
    </main>
  );
}
