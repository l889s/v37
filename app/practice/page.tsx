import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { ALL_CLASSIFIERS } from "@/lib/classifiersPro";

export const metadata: Metadata = {
  title: "تمارين Flashcards",
  description:
    "بطاقات تفاعلية مع نطق صوتي وأمثلة — تعلَّم بأسلوب الـSpaced Repetition.",
};

export default function PracticePage() {
  const items = ALL_CLASSIFIERS;
  return (
    <main className="min-h-screen">
      <Hero
        title="تمارين Flashcards"
        subtitle="راجع المصنِّفات بطريقة تفاعلية — اكشف الإجابة بعد التفكير"
        emoji="✨"
        kicker="练习 · ممارسة"
      />
      <FlashcardDeck items={items} />
    </main>
  );
}
