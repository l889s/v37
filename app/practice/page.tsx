import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { PracticeClient } from "@/components/PracticeClient";
import { WORDS_BY_LEVEL } from "@/lib/hskWords";

export const metadata: Metadata = {
  title: "تمارين Flashcards",
  description:
    "بطاقات تفاعلية مع نطق صوتي — راجع كلمات HSK بأسلوب Spaced Repetition.",
};

/** المستويات المتاحة للتمارين */
const PRACTICE_LEVELS = [
  { id: "hsk1-2", label: "HSK 1-2", badge: "HSK 2.0", emoji: "🌱" },
  { id: "hsk3",   label: "HSK 3",   badge: "HSK 2.0", emoji: "📗" },
  { id: "hsk4",   label: "HSK 4",   badge: "HSK 2.0", emoji: "📘" },
  { id: "hsk5",   label: "HSK 5",   badge: "HSK 2.0", emoji: "📙" },
  { id: "hsk6",   label: "HSK 6",   badge: "HSK 2.0", emoji: "🏆" },
  { id: "n1",     label: "N1",      badge: "HSK 3.0", emoji: "🌿" },
  { id: "n2",     label: "N2",      badge: "HSK 3.0", emoji: "🌾" },
  { id: "n3",     label: "N3",      badge: "HSK 3.0", emoji: "🌳" },
  { id: "n4",     label: "N4",      badge: "HSK 3.0", emoji: "🌲" },
  { id: "n5",     label: "N5",      badge: "HSK 3.0", emoji: "🎋" },
  { id: "n6",     label: "N6",      badge: "HSK 3.0", emoji: "🎍" },
  { id: "n789",   label: "N7-8-9",  badge: "HSK 3.0", emoji: "🚀" },
];

export default function PracticePage() {
  // نمرّر البيانات للـ Client (Server Component → Client Component)
  const levelsWithCount = PRACTICE_LEVELS.map((lv) => ({
    ...lv,
    count: WORDS_BY_LEVEL[lv.id]?.length ?? 0,
  }));

  return (
    <main className="min-h-screen pb-24">
      <Hero
        title="تمارين Flashcards"
        subtitle="اختر المستوى وابدأ المراجعة — اكشف الإجابة بعد التفكير"
        emoji="✨"
        kicker="练习 · ممارسة"
      />
      <PracticeClient levels={levelsWithCount} wordsByLevel={WORDS_BY_LEVEL} />
    </main>
  );
}
