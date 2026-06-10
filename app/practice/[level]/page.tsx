import { notFound } from "next/navigation";
import { getHskLevel, getWordsForLevel } from "@/lib/data";
import { FlashcardClient } from "./FlashcardClient";

interface Props {
  params: Promise<{ level: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { level: levelId } = await params;
  const result = getHskLevel(levelId);
  if (!result) return {};
  return { title: `مراجعة ${result.level.label}` };
}

export default async function PracticeLevelPage({ params }: Props) {
  const { level: levelId } = await params;

  const result = getHskLevel(levelId);
  if (!result) notFound();

  const { level } = result;
  const words = getWordsForLevel(levelId);

  if (words.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-3 text-5xl">🌿</div>
          <h2 className="text-[18px] font-extrabold text-ink">قيد الإعداد</h2>
          <p className="mt-2 text-[13px] text-muted">
            كلمات هذا المستوى ستُضاف تدريجياً.
          </p>
        </div>
      </main>
    );
  }

  return <FlashcardClient level={level} words={words} />;
}
