import { Hero } from "@/components/Hero";
import { SectionCard } from "@/components/SectionCard";
import { OnboardingGate } from "@/components/OnboardingGate";
import { getSections } from "@/lib/data";

export default function HomePage() {
  const sections = getSections();
  return (
    <main className="pb-6">
      {/* يظهر فقط للمستخدم الجديد (مرة واحدة) */}
      <OnboardingGate />

      <Hero
        title="ابدأ رحلتك في اللغة الصينية"
        subtitle="تعلَّم مفردات HSK مع النطق الصوتي — اختر القسم المناسب لمستواك"
      />

      <section className="mx-auto flex max-w-2xl flex-col gap-4 px-4 sm:px-5">
        {sections.map((s) => (
          <SectionCard key={s.id} section={s} />
        ))}
      </section>
    </main>
  );
}
