import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { AchievementsClient } from "@/components/AchievementsClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "إنجازاتي",
  description:
    "تابع سلسلتك اليومية، تقدّم إتقانك، وتوزيع تقييماتك — كل تفاصيل رحلتك في تعلم HSK.",
};

export default function AchievementsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero
        title="إنجازاتي"
        subtitle="تتبّع رحلتك في تعلُّم الصينية"
        emoji="🏆"
        kicker="成就 · الإنجازات"
      />
      <AchievementsClient />
    </main>
  );
}
