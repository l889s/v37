import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { HskLevelsClient } from "@/components/HskLevelsClient";
import { HskLevelsSkeleton } from "@/components/HskLevelsSkeleton";

export const metadata: Metadata = {
  title: "مستويات HSK",
  description:
    "تصفّح مستويات HSK 2.0 و HSK 3.0 — تتبّع تقدّمك في كل مستوى وابدأ المراجعة الذكية.",
};

export default function HskLevelsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero
        title="مستويات HSK"
        subtitle="اختر النظام والمستوى الذي يناسبك"
        emoji="📚"
        kicker="水平 · المستويات"
      />
      {/* Suspense مطلوب لأن HskLevelsClient يستخدم useSearchParams */}
      <Suspense fallback={<HskLevelsSkeleton />}>
        <HskLevelsClient />
      </Suspense>
    </main>
  );
}
